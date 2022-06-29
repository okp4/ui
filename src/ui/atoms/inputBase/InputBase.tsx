/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import React from 'react'
import type { RefObject } from 'react'
import classNames from 'classnames'
import './inputBase.scss'

export type InputBaseProps = Readonly<{
  /**
   * Placeholder text.
   */
  readonly placeholder?: string
  /**
   * Defines the callback called when the input value changes.
   */
  readonly onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  /**
   * The value of the `input` element, required for a controlled component.
   */
  readonly value?: string | string[]
  /*
   * The default value. Use when the component is not controlled.
   */
  readonly defaultValue?: string | string[]
  /**
   * Indicates if the input area is disabled.
   */
  readonly disabled?: boolean
  /**
   * If true, the input is displayed in an error state.
   */
  readonly hasError?: boolean
  /**
   * Pass a ref to the input element.
   */
  readonly inputRef?: RefObject<HTMLInputElement>
}>

export const InputBase = ({
  defaultValue,
  disabled = false,
  hasError = false,
  inputRef,
  onChange,
  placeholder,
  value
}: InputBaseProps): JSX.Element => {
  const inputClass = classNames(`okp4-input-base`, { error: hasError })
  return (
    <input
      className={inputClass}
      defaultValue={defaultValue}
      disabled={disabled}
      onChange={onChange}
      placeholder={placeholder}
      ref={inputRef}
      value={value}
    />
  )
}
