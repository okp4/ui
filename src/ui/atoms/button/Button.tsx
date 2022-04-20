import classNames from 'classnames'
import React from 'react'
import type { DeepReadonly } from 'superTypes'
import { Typography } from '../typography/Typography'
import './button.scss'

export type TButtonProps = DeepReadonly<{
  /**
   * The variant of the main button design
   */
  readonly variant?: 'primary' | 'secondary'
  /**
   * How large should the button be?
   */
  readonly size?: 'small' | 'medium' | 'large'
  /**
   * The color of the component, regarding the current theme and following semantic color naming.
   */
  readonly backgroundColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  /**
   * Button contents.
   */
  readonly label: string
  /**
   * If true, the component is disabled.
   */
  readonly disabled?: boolean
  /**
   * The callback function called when button is clicked.
   * The `onClick` function is an event handler attached to the button just like a normal HTML
   * `<button>`.
   */
  readonly onClick?: () => void
}>

/**
 * Primary UI component for user interaction.
 */
export const Button: React.FC<TButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  backgroundColor = 'primary',
  disabled = false,
  label,
  onClick,
  ...props
}: TButtonProps): JSX.Element => (
  <button
    className={classNames('okp4-button-main', {
      [`variant-${variant}`]: true,
      [`size-${size}`]: true,
      [`background-color-${backgroundColor}`]: true,
      disabled: !!disabled
    })}
    disabled={disabled}
    onClick={onClick}
    title={label}
    type="button"
    {...props}
  >
    <Typography as="div" color="highlighted-text" fontSize="small" fontWeight="light" noWrap>
      {label}
    </Typography>
  </button>
)
