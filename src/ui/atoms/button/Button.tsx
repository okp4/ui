import classNames from 'classnames'
import React from 'react'
import type { DeepReadonly } from 'superTypes'
import { Typography } from 'ui/atoms/typography/Typography'
import './button.scss'

export type TButtonProps = DeepReadonly<{
  /**
   * The variant of the main button design.
   */
  readonly variant?: 'primary' | 'secondary' | 'icon'
  /**
   * How large should the button be?
   */
  readonly size?: 'small' | 'medium' | 'large'
  /**
   * The color of the component, regarding the current theme and following semantic color naming.
   */
  readonly backgroundColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  /**
   * Button label used to convey its action.
   */
  readonly label: string
  /**
   * If true, the component is disabled.
   */
  readonly disabled?: boolean
  /**
   * Icon for the icon variant.
   */
  readonly icon?: JSX.Element
  /**
   * Icon left of label.
   */
  readonly leftIcon?: JSX.Element
  /**
   * Icon right of label.
   */
  readonly rightIcon?: JSX.Element
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
  leftIcon,
  rightIcon,
  icon,
  onClick
}: TButtonProps): JSX.Element => (
  <button
    className={classNames('okp4-button-main', {
      [`variant-${variant}`]: true,
      [`size-${size}`]: true,
      [`background-color-${backgroundColor}`]: true,
      disabled
    })}
    disabled={disabled}
    onClick={onClick}
    title={label}
    type="button"
  >
    {variant === 'icon' ? (
      icon
    ) : (
      <div className="okp4-button-content">
        {leftIcon}
        <Typography as="div" color="invariant-text" fontSize="small" fontWeight="light">
          {label}
        </Typography>
        {rightIcon}
      </div>
    )}
  </button>
)
