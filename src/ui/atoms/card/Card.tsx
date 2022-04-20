import classNames from 'classnames'
import React from 'react'
import './card.scss'

export type TCardProps = Readonly<{
  /**
   * Card content
   */
  readonly content?: Readonly<JSX.Element>
  /**
   * Card footer
   */
  readonly footer?: Readonly<JSX.Element>
  /**
   * Card header
   */
  readonly header?: Readonly<JSX.Element>
  /**
   * How large should the button be
   */
  readonly size?: 'small' | 'medium' | 'large'
  /**
   * Background theme
   */
  readonly background?: 'primary' | 'secondary' | 'header' | 'footer'
  /**
   * Whether card has a border
   */
  readonly withBorder?: boolean
}>

/**
 * Primary UI component for user interaction.
 */
export const Card: React.FC<TCardProps> = ({
  content,
  footer,
  header,
  size = 'medium',
  background = 'primary',
  withBorder = false,
  ...props
}: TCardProps): JSX.Element => (
  <div
    className={classNames('okp4-card-main', {
      "okp4-card-small": size == 'small',
      "okp4-card-medium": size == 'medium',
      "okp4-card-large": size == 'large',
      "okp4-card-with-border": withBorder
    })}
    {...props}
  >
      {footer}
      <div>{background}</div>
      {content}
      {header}
  </div>
)
