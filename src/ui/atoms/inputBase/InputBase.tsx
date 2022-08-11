// This rule is deactivated because we can not add readonly on the entire ChangeEvent
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import React from 'react'
import type { RefObject } from 'react'
import classNames from 'classnames'
import './inputBase.scss'

export type InputBaseProps = {
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
  /**
   * The default value.
   * Used when the component is not controlled.
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
  /**
   * The max length of the value of the input.
   */
  readonly maxLength?: number
  /**
   * The icon displayed on the right side.
   */
  readonly rightIcon?: JSX.Element
  /**
   * If true, input becomes immutable
   */
  readonly readOnly?: boolean
}

type IconProps = {
  icon: JSX.Element
}

const RightIcon = ({ icon }: IconProps): JSX.Element => (
  <div className="okp4-input-right-icon">{icon}</div>
)

export const InputBase = ({
  defaultValue,
  disabled = false,
  hasError = false,
  inputRef,
  onChange,
  placeholder,
  maxLength,
  rightIcon,
  value,
  readOnly = false
}: InputBaseProps): JSX.Element => {
  const containerClass = classNames(`okp4-input-base-container`, {
    'with-icon': !!rightIcon,
    error: hasError,
    disabled
  })
  const inputClass = classNames(`okp4-input-base-main`, {
    error: hasError
  })

  return (
    <div className={containerClass}>
      <input
        className={inputClass}
        defaultValue={defaultValue}
        disabled={disabled}
        maxLength={maxLength}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        ref={inputRef}
        value={value}
      />
      {rightIcon && <RightIcon icon={rightIcon} />}
    </div>
  )
}
