import React, { useCallback, useState } from 'react'
import short from 'short-uuid'
import type { DeepReadonly, ReadableFileSize, UseState } from 'superTypes'
import { areFilesAccepted, asMutable, toReadableFileSize } from 'utils'
import { useFileDispatch, useFileSelector } from 'hook/storeHook/fileHook'
import { storeFiles, removeFile, removeAllFiles, getFiles } from 'domain/file'
import type { ThunkResult } from 'domain/file/store/store'
import type { FileDescriptor } from 'domain/file/store/selector/file.selector'
import { useTranslation } from 'hook/useTranslation'
import type { UseTranslationResponse } from 'hook/useTranslation'
import { FileInput } from 'ui/atoms/fileInput/FileInput'
import type { FileInputProps } from 'ui/atoms/fileInput/FileInput'
import { Icon } from 'ui/atoms/icon/Icon'
import { ListItem } from 'ui/atoms/listItem/ListItem'
import { Typography } from 'ui/atoms/typography/Typography'
import { List } from 'ui/atoms/list/List'
import './filePicker.scss'
import './i18n/index'

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
  clearAll = true,
  size = 'large',
  ...props
}: DeepReadonly<FilePickerProps>) => {
  const { t }: UseTranslationResponse = useTranslation()
  const fileDispatch = useFileDispatch()
  const fileList: FileDescriptor[] = useFileSelector(getFiles)
  const [isError, setError]: UseState<boolean> = useState(false)
  const [errorMessage, setErrorMessage]: UseState<string> = useState('')

  const displayFileSize = (size: number): string => {
    const { value, unit }: ReadableFileSize = toReadableFileSize(size, (size: number) =>
      Number(size.toFixed(2))
    )
    return `${value} ${t(`filePicker:filePicker.fileSizeUnit.${unit}`)}`
  }

  const handleDropped = useCallback(
    (files: DeepReadonly<File[]>) => {
      if (areFilesAccepted(files, props.acceptedFormats)) {
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
        setErrorMessage(t('filePicker:filePicker.errorMessage.type'))
      }
    },
    [props.acceptedFormats, fileDispatch, t]
  )

  const handleRemove = useCallback(
    (id: string) => (): ThunkResult<Promise<void>> => fileDispatch(removeFile(id)),
    [fileDispatch]
  )

  const handleRemoveAll = useCallback(
    (): ThunkResult<Promise<void>> => fileDispatch(removeAllFiles()),
    [fileDispatch]
  )

  const RemoveIcon = ({ id }: Readonly<{ id: string }>): JSX.Element => (
    <div className="okp4-file-picker-list-item-delete" onClick={handleRemove(id)}>
      <Icon invertColor name="close" />
    </div>
  )

  const FileItem = ({ id, name, size }: FileDescriptor): JSX.Element => (
    <ListItem
      description={
        <Typography as="div" color="inverted-text" fontSize="small" fontWeight="xlight">
          {displayFileSize(size)}
        </Typography>
      }
      key={id}
      rightElement={<RemoveIcon id={id} />}
      title={name}
    />
  )

  return (
    <div className="okp4-file-picker-main">
      <FileInput
        {...props}
        acceptedFormats={asMutable(props.acceptedFormats)}
        error={isError}
        errorMessage={errorMessage}
        onDropped={handleDropped}
        size={size}
      />
      {clearAll && fileList.length > 1 && (
        <div className="okp4-file-picker-clear-all" onClick={handleRemoveAll}>
          <Typography fontSize="x-small" fontWeight="xlight" textDecoration="underline">
            {t('filePicker:filePicker.clearAll')}
          </Typography>
        </div>
      )}
      <List>{fileList.reverse().map((file: FileDescriptor) => FileItem(file))}</List>
    </div>
  )
}
