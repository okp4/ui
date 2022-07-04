/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import classNames from 'classnames'
import React from 'react'
import { Typography } from '../typography/Typography'
import { InputBase } from '../inputBase/InputBase'
import type { InputBaseProps } from '../inputBase/InputBase'
import './textField.scss'

export type TextFieldProps = InputBaseProps &
  Readonly<{
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
  }>

export const TextField: React.FC<TextFieldProps> = ({
  size = 'medium',
  disabled = false,
  hasError = false,
  placeholder,
  onChange,
  value,
  defaultValue,
  helperText,
  inputRef,
  fullWidth = false
}: TextFieldProps): JSX.Element => {
  const containerClass = classNames(`okp4-text-field-main ${size}`, { 'full-width': fullWidth })

  return (
    <div className={containerClass}>
      <InputBase
        defaultValue={defaultValue}
        disabled={disabled}
        hasError={hasError}
        inputRef={inputRef}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
      />
      {helperText && (
        <Typography
          as="div"
          color={hasError ? 'error' : 'info'}
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
