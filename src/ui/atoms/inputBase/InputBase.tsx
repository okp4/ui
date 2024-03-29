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
  readonly onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
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
   * Pass a ref to the element.
   */
  readonly ref?: RefObject<HTMLInputElement | HTMLTextAreaElement>
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
  /**
   * If true, the input will take 100% of its parent's size.
   */
  readonly fullWidth?: boolean
  /**
   * Whether input has a themed border.
   */
  readonly withBorder?: boolean
}

type IconProps = {
  icon: JSX.Element
}

const RightIcon = ({ icon }: IconProps): JSX.Element => (
  <div className="okp4-input-right-icon">{icon}</div>
)

// eslint-disable-next-line max-lines-per-function
export const InputBase = ({
  defaultValue,
  disabled = false,
  hasError = false,
  ref,
  onChange,
  placeholder,
  rightIcon,
  value,
  readOnly = false,
  multiline = false,
  numberOfLines,
  disableAreaResize = false,
  fullWidth = false,
  withBorder = false
}: InputBaseProps): JSX.Element => {
  const containerClass = classNames(`okp4-input-base-container`, {
    'with-icon': !!rightIcon,
    error: hasError,
    disabled,
    border: withBorder
  })
  const inputClass = classNames(`okp4-input-base-main`, {
    error: hasError
  })
  const textareaClass = classNames(inputClass, 'okp4-input-base-textarea', {
    'disable-resize': multiline && disableAreaResize,
    'resize-height-only': fullWidth && multiline
  })
  const props = {
    defaultValue,
    disabled,
    onChange,
    placeholder,
    readOnly,
    value
  }

  return (
    <div className={containerClass}>
      {multiline ? (
        <textarea
          className={textareaClass}
          ref={ref as RefObject<HTMLTextAreaElement>}
          rows={numberOfLines}
          {...props}
        />
      ) : (
        <input className={inputClass} ref={ref as RefObject<HTMLInputElement>} {...props} />
      )}
      {rightIcon && <RightIcon icon={rightIcon} />}
    </div>
  )
}
