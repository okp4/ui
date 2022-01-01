import classNames from 'classnames'
import styles from './Button.module.scss'

export type TButtonProps = Readonly<{
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * Button contents.
   */
  label: string
  /**
   * The callback function called when button is clicked.
   * The `onClick` function is an event handler attached to the button just like a normal HTML
   * `<button>`.
   */
  onClick?: () => void
}>

/**
 * Primary UI component for user interaction.
 */
export const Button = ({
  primary = false,
  size = 'medium',
  label,
  onClick,
  ...props
}: TButtonProps): JSX.Element => (
  <button
    type="button"
    className={classNames(styles.core, {
      [styles.normal]: !primary,
      [styles.primary]: primary,
      [styles.small]: size == 'small',
      [styles.medium]: size == 'medium',
      [styles.large]: size == 'large',
    })}
    onClick={onClick}
    {...props}
  >
    {label}
  </button>
)
