import classNames from 'classnames'
import React from 'react'
import styles from './Button.module.scss'

export type TButtonProps = Readonly<{
  /**
   * Is this the principal call to action on the page?
   */
  readonly primary?: boolean
  /**
   * How large should the button be?
   */
  readonly size?: 'small' | 'medium' | 'large'
  /**
   * Button contents.
   */
  readonly label: string
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
  primary = false,
  size = 'medium',
  label,
  onClick,
  ...props
}: TButtonProps): JSX.Element => (
  <button
    className={classNames(styles.core, {
      [styles.normal]: !primary,
      [styles.primary]: primary,
      [styles.small]: size == 'small',
      [styles.medium]: size == 'medium',
      [styles.large]: size == 'large'
    })}
    onClick={onClick}
    type="button"
    {...props}
  >
    {label}
  </button>
)
