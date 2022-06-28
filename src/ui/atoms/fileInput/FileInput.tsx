import './fileInput.scss';

import React, { useCallback } from 'react';

import fileInputIcon from '../../../assets/images/file-input-icon.png';
import { Typography } from '../typography/Typography';

import type { DeepReadonly } from 'superTypes'

export type FileUploadProps = DeepReadonly<{
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
   * Callback method performs when files are dropped
   */
  readonly onDropped: (files: DeepReadonly<FileList>) => void
}>
export const FileInput: React.FC<FileUploadProps> = ({
  label,
  description,
  multiple = true,
  acceptedFormats,
  size = 'medium',
  onDropped
}: FileUploadProps): JSX.Element => {
  const handleOnChange = useCallback(
    // lint rule bypassed because of type 'Element' is not compatible with readonly
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (files) {
        onDropped(files)
      }
    },
    [onDropped]
  )

  return (
    <div className={`okp4-fileinput-main ${size} `}>
      <label className="okp4-fileinput-container">
        <input
          accept={acceptedFormats?.join(', ')}
          id="input-file"
          multiple={multiple}
          onChange={handleOnChange}
          type="file"
        />
        <div>
          <img src={fileInputIcon} />
          <Typography as="div" fontSize={size === 'small' ? 'small' : 'medium'} fontWeight="light">
            {label}
          </Typography>
          <div className="okp4-fileinput-description">{description}</div>
        </div>
      </label>
    </div>
  )
}
