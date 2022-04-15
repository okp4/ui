import classNames from 'classnames'
import type { RefObject } from 'react'
import React from 'react'
import './textInput.scss'
import '../../styles/main.scss'

export type TextInputProps = Readonly<{
  /**
   * How large should the font size be.
   */
  readonly size?: 'x-large' | 'large' | 'medium' | 'small' | 'x-small'
  /**
   * Placeholder text.
   */
  readonly placeholder?: string
  /**
   * Define the callback called when the input value changes.
   */
  readonly onChange?: React.ChangeEventHandler<HTMLInputElement>
  /**
   * The value of the `input` element, required for a controlled component.
   */
  readonly value?: string
  /**
   * The default value. Use when the component is not controlled.
   */
  readonly defaultValue?: string

  /**
   * Tells if the input can be edited.
   */
  readonly disabled?: boolean

  /**
   * Indicates that the input is not valid.
   */
  readonly error?: boolean
  /**
   * An helper message to display when the input is not valid.
   */
  readonly helperText?: React.ReactNode

  /**
   * Reference to the object
   */
  readonly inputRef?: RefObject<HTMLInputElement>
}>

/**
 * Primary UI component for text input
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const TextInput: React.FC<TextInputProps> = ({
  size = 'medium',
  placeholder = 'Placeholder',
  disabled = false,
  error = false,
  onChange,
  value,
  defaultValue,
  helperText,
  inputRef,
  ...props
}: TextInputProps): JSX.Element => {
  const inputClass = classNames(`okp4-textinput-core okp4-font-size-${size}`, { ['error']: error })

  return (
    <div>
      <input
        className={inputClass}
        defaultValue={defaultValue}
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder}
        ref={inputRef}
        value={value}
        {...props}
      />
      <div>{helperText}</div>
    </div>
  )
}
