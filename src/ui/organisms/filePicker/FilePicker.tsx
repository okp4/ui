import React, { useCallback } from 'react'
import short from 'short-uuid'
import type { DeepReadonly, SizeUnit } from 'superTypes'
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

export type FilePickerProps = Pick<
  FileInputProps,
  'label' | 'description' | 'multiple' | 'acceptedFormats' | 'size'
> & {
  readonly sizeUnit?: SizeUnit
}

// eslint-disable-next-line max-lines-per-function
export const FilePicker: React.FC<FilePickerProps> = ({ sizeUnit, ...props }: FilePickerProps) => {
  const { t }: UseTranslationResponse = useTranslation()
  const fileDispatch = useFileDispatch()
  const fileList: FileDescriptor[] = useFileSelector(getFiles)

  const convertSize = (size: number, unit?: SizeUnit): string => {
    if (!unit) {
      return `${size}`
    }
    const unitStr = t(`filePicker:filePicker.unit.${unit}`)
    switch (unit) {
      case 'B':
        return `${size.toFixed(2)} ${unitStr}`
      case 'KB':
        return `${(size / Math.pow(10, 3)).toFixed(2)} ${unitStr}`
      case 'MB':
        return `${(size / Math.pow(10, 6)).toFixed(2)} ${unitStr}`
      case 'GB':
        return `${(size / Math.pow(10, 9)).toFixed(2)} ${unitStr}`
      case 'TB':
        return `${(size / Math.pow(10, 12)).toFixed(2)} ${unitStr}`
      default:
        return `${size}`
    }
  }

  const handleDropped = useCallback(
    (files: DeepReadonly<File[]>) => {
      fileDispatch(
        storeFiles(
          files.map((file: DeepReadonly<File>) => {
            return {
              id: short.generate(),
              name: file.name,
              size: file.size,
              type: file.type,
              stream: new ReadableStream()
            }
          })
        )
      )
    },
    [fileDispatch]
  )

  const handleRemove = (id: string) => (): ThunkResult<Promise<void>> =>
    fileDispatch(removeFile(id))

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
          {convertSize(size, sizeUnit)}
        </Typography>
      }
      key={id}
      rightElement={RemoveIcon(id)}
      title={name}
    />
  )

  return (
    <div className="okp4-file-picker-main">
      <FileInput {...props} onDropped={handleDropped} />
      <List>{fileList.map((file: FileDescriptor) => FileItem(file))}</List>
    </div>
  )
}
