import React, { useCallback, useState } from 'react'
import short from 'short-uuid'
import type { DeepReadonly, SizeUnit, UseState } from 'superTypes'
import { asMutable, checkFileExtension, convertSize } from 'utils'
import { useFileDispatch, useFileSelector } from 'hook/storeHook/fileHook'
import { storeFiles } from 'domain/file/usecase/store-files/storeFiles'
import { removeFile } from 'domain/file/usecase/remove-file/removeFile'
import { getFiles } from 'domain/file/store/selector/file.selector'
import type { ThunkResult } from 'domain/file/store/store'
import type { FileDescriptor } from 'domain/file/store/selector/file.selector'
import type { FileInputProps } from 'ui/atoms/fileInput/FileInput'
import { useTranslation } from 'hook/useTranslation'
import type { UseTranslationResponse } from 'hook/useTranslation'
import { FileInput } from 'ui/atoms/fileInput/FileInput'
import { Icon } from 'ui/atoms/icon/Icon'
import { ListItem } from 'ui/atoms/listItem/ListItem'
import { Typography } from 'ui/atoms/typography/Typography'
import { List } from 'ui/atoms/list/List'
import './filePicker.scss'
import './i18n/index'
import { removeAllFiles } from 'domain/file'

export type FilePickerProps = Pick<
  FileInputProps,
  'label' | 'description' | 'multiple' | 'acceptedFormats' | 'size'
> & {
  /**
   * Displays a clickable text to delete all selected files.
   */
  readonly clearAll?: boolean
}

// eslint-disable-next-line max-lines-per-function
export const FilePicker: React.FC<FilePickerProps> = ({
  clearAll,
  acceptedFormats,
  ...props
}: DeepReadonly<FilePickerProps>) => {
  const { t }: UseTranslationResponse = useTranslation()
  const fileDispatch = useFileDispatch()
  const fileList: FileDescriptor[] = useFileSelector(getFiles)
  const [isError, setError]: UseState<boolean> = useState(false)
  const [errorMessage, setErrorMessage]: UseState<string> = useState('')

  const displaySize = (size: number): string => {
    const { value, unit }: { value: string; unit: SizeUnit } = convertSize(size)
    const unitStr = t(`filePicker:filePicker.unit.${unit}`)
    return `${value} ${unitStr}`
  }

  const handleDropped = useCallback(
    (files: DeepReadonly<File[]>) => {
      if (acceptedFormats && checkFileExtension(files, acceptedFormats)) {
        setError(false)
        fileDispatch(
          storeFiles(
            files.map((file: DeepReadonly<File>) => {
              return {
                id: short.generate(),
                name: file.name,
                size: file.size,
                type: file.type,
                stream: file.stream() as unknown as ReadableStream
              }
            })
          )
        )
      } else {
        setError(true)
        setErrorMessage(t(`filePicker:filePicker.errorMessage.format`))
      }
    },
    [acceptedFormats, fileDispatch, t]
  )

  const handleRemove = (id: string) => (): ThunkResult<Promise<void>> =>
    fileDispatch(removeFile(id))

  const handleRemoveAll = (): ThunkResult<Promise<void>> => fileDispatch(removeAllFiles())

  const RemoveIcon = (id: string): JSX.Element => {
    return (
      <div className="okp4-file-picker-list-delete" onClick={handleRemove(id)}>
        <Icon name="close" />
      </div>
    )
  }

  const FileItem = ({ id, name, size }: FileDescriptor): JSX.Element => (
    <ListItem
      description={
        <Typography as="div" fontFamily="brand" fontSize="small" fontWeight="xlight">
          {displaySize(size)}
        </Typography>
      }
      key={id}
      rightElement={RemoveIcon(id)}
      title={name}
    />
  )

  return (
    <div className="okp4-file-picker-main">
      <FileInput
        {...props}
        acceptedFormats={asMutable(acceptedFormats)}
        error={isError}
        errorMessage={errorMessage}
        onDropped={handleDropped}
      />
      {clearAll && fileList.length > 1 && (
        <div className="okp4-file-picker-clear-all" onClick={handleRemoveAll}>
          <Typography as="span" fontSize="x-small" fontWeight="xlight" textDecoration="underline">
            {t(`filePicker:filePicker.clearAll`)}
          </Typography>
        </div>
      )}
      <List>{fileList.map((file: FileDescriptor) => FileItem(file))}</List>
    </div>
  )
}
