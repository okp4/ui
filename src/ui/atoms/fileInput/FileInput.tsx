import React, { useCallback, useRef } from 'react'
import './fileInput.scss'
import classNames from 'classnames'
import fileInputIcon from 'assets/images/file.png'
import { Typography } from '../typography/Typography'
import type { DeepReadonly } from 'superTypes'
import { truthy } from 'utils'

export type FileInputProps = {
  /**
   * The main title of the file input.
   */
  readonly label?: string
  /**
   * Context information for the user.
   */
  readonly description?: JSX.Element
  /**
   * Drop one or several files.
   */
  readonly multiple?: boolean
  /**
   * The list of the accepted formats.
   */
  readonly acceptedFormats?: string[]
  /**
   * The size of the component.
   */
  readonly size?: 'large' | 'medium' | 'small'
  /**
   * Make the component in an error state or not.
   */
  readonly error?: boolean
  /**
   * An error message displayed when the component is in the error state.
   */
  readonly errorMessage?: string
  /**
   * Callback method called when files are dropped.
   */
  // lint rule bypassed in method props arguments
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  readonly onDropped: (files: File[]) => void
}

// lint rule bypassed while disabling the rule
// eslint-disable-next-line max-lines-per-function
export const FileInput: React.FC<FileInputProps> = ({
  label,
  description,
  multiple = true,
  acceptedFormats,
  size = 'medium',
  error = false,
  errorMessage,
  onDropped
}: DeepReadonly<FileInputProps>): JSX.Element => {
  const inputFileElement = useRef<HTMLDivElement>(null)
  const draggingClassname = 'dragging'

  const addDraggingClassName = useCallback((): void => {
    inputFileElement.current?.classList.add(draggingClassname)
  }, [])

  const removeDraggingClassName = useCallback((): void => {
    inputFileElement.current?.classList.remove(draggingClassname)
  }, [])

  type LabelDragEvent = React.DragEvent<HTMLLabelElement>

  // lint rule bypassed because of type 'Element' is not compatible with readonly
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const preventDefaultAndStopPropagation = useCallback((event: LabelDragEvent): void => {
    event.preventDefault()
    event.stopPropagation()
  }, [])

  const allowSelectSameFile = useCallback(
    // lint rule bypassed because of type 'Element' is not compatible with readonly
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (event: React.MouseEvent<HTMLInputElement>): void => {
      event.currentTarget.value = ''
    },
    []
  )

  const getFilesFromEvent = useCallback(
    // lint rule bypassed because of type 'Element' is not compatible with readonly
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (event: LabelDragEvent): File[] =>
      Array.from(event.dataTransfer.items)
        .map((item: DeepReadonly<DataTransferItem>) => item.getAsFile())
        .filter(truthy),
    []
  )

  const handleChange = useCallback(
    // lint rule bypassed because of type 'Element' is not compatible with readonly
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const filesList = event.target.files
      const files = filesList ? [...filesList] : []
      if (files.length) {
        onDropped(files)
      }
    },
    [onDropped]
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
    <div className={`okp4-fileinput-main ${size}`} ref={inputFileElement}>
      <label
        className={classNames('okp4-fileinput-container', { error })}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={preventDefaultAndStopPropagation}
        onDrop={handleDrop}
      >
        <input
          accept={acceptedFormats?.join(', ')}
          multiple={multiple}
          onChange={handleChange}
          onClick={allowSelectSameFile}
          type="file"
        />
        <div>
          <img src={fileInputIcon} />
          {label && (
            <Typography
              as="div"
              fontSize={size === 'small' ? 'small' : 'medium'}
              fontWeight="light"
            >
              {label}
            </Typography>
          )}
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
