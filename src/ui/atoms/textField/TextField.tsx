/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import classNames from 'classnames'
import React from 'react'
import { Typography } from '../typography/Typography'
import { InputBase } from '../inputBase/InputBase'
import type { InputBaseProps } from '../inputBase/InputBase'
import './textField.scss'

export type TextFieldProps = InputBaseProps & {
  /**
   * The size of the input field.
   * It will be automatically adjusted responsively to the screen size.
   */
  readonly size?: 'x-large' | 'large' | 'medium' | 'small' | 'x-small'
  /**
   * Displays a message to the user below the input area.
   */
  readonly helperText?: string
  /**
   * If true, the TextField will take 100% of its parent's size.
   */
  readonly fullWidth?: boolean
  /**
   * If true, the TextField allows multiline text as a text area.
   */
  readonly multiline?: boolean
  /**
   * If multiline, defines the number of lines of the text area.
   */
  readonly numberOfLines?: number
  /**
   * If true and multiline, the user can't resize the text area.
   */
  readonly disableAreaResize?: boolean
}

export const TextField: React.FC<TextFieldProps> = ({
  size = 'medium',
  helperText,
  fullWidth = false,
  multiline = false,
  numberOfLines,
  disableAreaResize = false,
  ...props
}: TextFieldProps): JSX.Element => {
  const containerClass = classNames(
    `okp4-text-field-main ${multiline && !disableAreaResize ? 'auto' : size}`,
    {
      'full-width': !multiline && fullWidth
    }
  )

  return (
    <div className={containerClass}>
      <InputBase
        disableAreaResize={disableAreaResize}
        multiline={multiline}
        numberOfLines={numberOfLines}
        {...props}
      />
      {helperText && (
        <Typography
          as="div"
          color={props.hasError ? 'error' : 'info'}
          fontSize="x-small"
          fontWeight="bold"
          noWrap
        >
          {helperText}
        </Typography>
      )}
    </div>
  )
}
