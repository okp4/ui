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
  readonly onChange?: (
    event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => void
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
   * Pass a ref to the textarea element.
   */
  readonly textareaRef?: RefObject<HTMLTextAreaElement>
  /**
   * The icon displayed on the right side.
   */
  readonly rightIcon?: JSX.Element
  /**
   * If true, input becomes immutable
   */
  readonly readOnly?: boolean
  /**
   * If true, input becomes a text area.
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
  textareaRef,
  onChange,
  placeholder,
  rightIcon,
  value,
  readOnly = false,
  multiline = false,
  numberOfLines,
  disableAreaResize = false
}: InputBaseProps): JSX.Element => {
  const containerClass = classNames(`okp4-input-base-container`, {
    'with-icon': !!rightIcon,
    error: hasError,
    disabled
  })
  const inputClass = classNames(`okp4-input-base-main`, {
    error: hasError
  })
  const textareaClass = classNames(inputClass, 'okp4-input-base-textarea', {
    'disable-resize': multiline && disableAreaResize
  })

  const props = {
    defaultValue: defaultValue,
    disabled: disabled,
    onChange: onChange,
    placeholder: placeholder,
    readOnly: readOnly,
    value: value
  }

  return (
    <div className={containerClass}>
      {multiline ? (
        <textarea className={textareaClass} ref={textareaRef} rows={numberOfLines} {...props} />
      ) : (
        <input className={inputClass} ref={inputRef} {...props} />
      )}
      {rightIcon && <RightIcon icon={rightIcon} />}
    </div>
  )
}
