import './fileInput.scss'

import React, { useCallback, useState } from 'react'

import fileInputIcon from '../../../assets/images/file-input-icon.png'
import { Typography } from '../typography/Typography'

import type { DeepReadonly } from 'superTypes'

export type FileUploadProps = DeepReadonly<{
  /**
   * The id of the component in the DOM
   */
  readonly id: string
  /**
   * The main title
   */
  readonly label: string
  /**
   * Context information for the user
   */
  readonly description?: Readonly<JSX.Element>

  /**
   * Drop one or several files
   */
  readonly multiple?: boolean

  /**
   * The list of the accepted formats
   */
  readonly acceptedFormats?: string[]

  /**
   * The drag and drop content size
   */
  readonly size?: 'large' | 'medium' | 'small'

  /**
   * Make the component in an error state or not
   */
  readonly error?: boolean

  /**
   * An error message displayed when the component is in the error state
   */
  readonly errorMessage?: string

  /**
   * Callback method performs when files are dropped
   */
  readonly onDropped: (files: DeepReadonly<File[]>) => void
}>

// lint rule bypassed while disabling the rule
// eslint-disable-next-line max-lines-per-function
export const FileInput: React.FC<FileUploadProps> = ({
  id,
  label,
  description,
  multiple = true,
  acceptedFormats,
  size = 'medium',
  error = false,
  errorMessage,
  onDropped
}: FileUploadProps): JSX.Element => {
  const inputFileId = id + '-inputfile'
  const dropZoneId = id + '-dropzone'
  const draggingClassname = 'dragging'

  const [dragEventCount, setDragEventCount]: [number, (count: number) => void] = useState<number>(0)

  type LabelDragEvent = React.DragEvent<HTMLLabelElement>

  const addDraggingClassName = useCallback((): void => {
    const inputFileElement = document.getElementById(dropZoneId)
    if (inputFileElement) {
      inputFileElement.classList.add(draggingClassname)
    }
  }, [dropZoneId])

  const removeDraggingClassName = useCallback((): void => {
    const inputFileElement = document.getElementById(dropZoneId)
    if (inputFileElement) {
      inputFileElement.classList.remove(draggingClassname)
    }
  }, [dropZoneId])

  // lint rule bypassed because of type 'Element' is not compatible with readonly
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const eventPreventDefaultAndStopPropagation = useCallback((event: LabelDragEvent): void => {
    event.preventDefault()
    event.stopPropagation()
  }, [])

  const getFilesFromEvent = useCallback(
    // lint rule bypassed because of type 'Element' is not compatible with readonly
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (event: LabelDragEvent): DeepReadonly<File[]> =>
      Array.from(event.dataTransfer.items).reduce(
        (acc: DeepReadonly<File[]>, cur: DeepReadonly<DataTransferItem>) => {
          const file: File | null = cur.getAsFile()
          return file ? [...acc, file] : acc
        },
        []
      ),
    []
  )

  const handleOnChange = useCallback(
    // lint rule bypassed because of type 'Element' is not compatible with readonly
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const filesList = event.target.files
      const files = filesList ? [...filesList] : []
      onDropped(files)
    },
    [onDropped]
  )

  const handleOnDragOver = useCallback(
    // lint rule bypassed because of type 'Element' is not compatible with readonly
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (event: LabelDragEvent) => {
      eventPreventDefaultAndStopPropagation(event)
    },
    [eventPreventDefaultAndStopPropagation]
  )

  const handleOnDragEnter = useCallback(
    // lint rule bypassed because of type 'Element' is not compatible with readonly
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (event: LabelDragEvent) => {
      eventPreventDefaultAndStopPropagation(event)
      setDragEventCount(dragEventCount + 1)
      addDraggingClassName()
    },
    [eventPreventDefaultAndStopPropagation, addDraggingClassName, dragEventCount]
  )

  const handleOnDragLeave = useCallback(
    // lint rule bypassed because of type 'Element' is not compatible with readonly
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (event: LabelDragEvent) => {
      eventPreventDefaultAndStopPropagation(event)
      setDragEventCount(dragEventCount - 1)
      if (dragEventCount - 1 === 0) {
        removeDraggingClassName()
      }
    },
    [eventPreventDefaultAndStopPropagation, dragEventCount, removeDraggingClassName]
  )

  const handleOnDrop = useCallback(
    // lint rule bypassed because of type 'Element' is not compatible with readonly
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    async (event: LabelDragEvent) => {
      eventPreventDefaultAndStopPropagation(event)
      setDragEventCount(dragEventCount - 1)
      removeDraggingClassName()
      onDropped(getFilesFromEvent(event))
    },
    [
      eventPreventDefaultAndStopPropagation,
      dragEventCount,
      removeDraggingClassName,
      getFilesFromEvent,
      onDropped
    ]
  )

  return (
    <div className={`okp4-fileinput-main ${size} `} id={dropZoneId}>
      <input
        accept={acceptedFormats?.join(', ')}
        id={inputFileId}
        multiple={multiple}
        onChange={handleOnChange}
        type="file"
      />
      <label
        className={`okp4-fileinput-container ${error ? 'error' : ''}`}
        htmlFor={inputFileId}
        onDragEnter={handleOnDragEnter}
        onDragLeave={handleOnDragLeave}
        onDragOver={handleOnDragOver}
        onDrop={handleOnDrop}
      >
        <div>
          <img src={fileInputIcon} />
          <Typography as="div" fontSize={size === 'small' ? 'small' : 'medium'} fontWeight="light">
            {label}
          </Typography>
          <div className="okp4-fileinput-description">{description}</div>
          {error && errorMessage ? (
            <div>
              <Typography as="div" color="error" fontSize="small" fontWeight="light">
                {errorMessage}
              </Typography>
            </div>
          ) : null}
        </div>
      </label>
    </div>
  )
}
