import React, { useCallback } from 'react'
import './fileInput.scss'
import classNames from 'classnames'
import fileInputIcon from '../../../assets/images/file.png'
import { Typography } from '../typography/Typography'
import type { DeepReadonly } from 'superTypes'

export type FileUploadProps = {
  /**
   * The unique id of the component
   */
  readonly id: string
  /**
   * The main title
   */
  readonly label?: string
  /**
   * Context information for the user
   */
  readonly description?: JSX.Element
  /**
   * Drop one or several files
   */
  readonly multiple?: boolean
  /**
   * The list of the accepted formats
   */
  readonly acceptedFormats?: string[]
  /**
   * The size of the component
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
  // lint rule bypassed in method props arguments
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  readonly onDropped: (files: File[]) => void
}

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
}: DeepReadonly<FileUploadProps>): JSX.Element => {
  const inputFileId = `${id}-inputfile`
  const dropZoneId = `${id}-dropzone`
  const draggingClassname = 'dragging'

  type LabelDragEvent = React.DragEvent<HTMLLabelElement>

  const getInputFileElement = useCallback(
    (): HTMLElement | null => document.getElementById(dropZoneId),
    [dropZoneId]
  )

  const addDraggingClassName = useCallback((): void => {
    getInputFileElement()?.classList.add(draggingClassname)
  }, [getInputFileElement])

  const removeDraggingClassName = useCallback((): void => {
    getInputFileElement()?.classList.remove(draggingClassname)
  }, [getInputFileElement])

  // lint rule bypassed because of type 'Element' is not compatible with readonly
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const preventDefaultAndStopPropagation = useCallback((event: LabelDragEvent): void => {
    event.preventDefault()
    event.stopPropagation()
  }, [])

  const getFilesFromEvent = useCallback(
    // lint rule bypassed because of type 'Element' is not compatible with readonly
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (event: LabelDragEvent): File[] =>
      Array.from(event.dataTransfer.items)
        .map((item: DeepReadonly<DataTransferItem>) => item.getAsFile())
        .filter((file: DeepReadonly<File> | null): file is File => !!file),
    []
  )

  const handleChange = useCallback(
    // lint rule bypassed because of type 'Element' is not compatible with readonly
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const filesList = event.target.files
      const files = filesList ? [...filesList] : []
      onDropped(files)
    },
    [onDropped]
  )

  const handleDragOver = useCallback(
    // lint rule bypassed because of type 'Element' is not compatible with readonly
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (event: LabelDragEvent) => {
      preventDefaultAndStopPropagation(event)
    },
    [preventDefaultAndStopPropagation]
  )

  const handleDragEnter = useCallback(
    // lint rule bypassed because of type 'Element' is not compatible with readonly
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (event: LabelDragEvent) => {
      preventDefaultAndStopPropagation(event)
      addDraggingClassName()
    },
    [preventDefaultAndStopPropagation, addDraggingClassName]
  )

  const handleDragLeave = useCallback(
    // lint rule bypassed because of type 'Element' is not compatible with readonly
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (event: LabelDragEvent) => {
      preventDefaultAndStopPropagation(event)
      removeDraggingClassName()
    },
    [preventDefaultAndStopPropagation, removeDraggingClassName]
  )

  const handleDrop = useCallback(
    // lint rule bypassed because of type 'Element' is not compatible with readonly
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    async (event: LabelDragEvent) => {
      preventDefaultAndStopPropagation(event)
      removeDraggingClassName()
      onDropped(getFilesFromEvent(event))
    },
    [preventDefaultAndStopPropagation, removeDraggingClassName, getFilesFromEvent, onDropped]
  )

  return (
    <div className={`okp4-fileinput-main ${size}`} id={dropZoneId}>
      <input
        accept={acceptedFormats?.join(', ')}
        id={inputFileId}
        multiple={multiple}
        onChange={handleChange}
        type="file"
      />
      <label
        className={classNames('okp4-fileinput-container', error && 'error')}
        htmlFor={inputFileId}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div>
          <img src={fileInputIcon} />
          <Typography as="div" fontSize={size === 'small' ? 'small' : 'medium'} fontWeight="light">
            {label}
          </Typography>
          <div className="okp4-fileinput-description">{description}</div>
          {error && errorMessage && (
            <div>
              <Typography as="div" color="error" fontSize="small" fontWeight="light">
                {errorMessage}
              </Typography>
            </div>
          )}
        </div>
      </label>
    </div>
  )
}
