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
   * If true, the TextField will take 100% of its parent's size
   */
  readonly fullWidth?: boolean
}

export const TextField: React.FC<TextFieldProps> = ({
  size = 'medium',
  helperText,
  fullWidth = false,
  ...props
}: TextFieldProps): JSX.Element => {
  const containerClass = classNames(`okp4-text-field-main ${size}`, { 'full-width': fullWidth })

  return (
    <div className={containerClass}>
      <InputBase {...props} />
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
