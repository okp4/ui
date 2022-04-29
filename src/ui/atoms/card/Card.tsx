import classNames from 'classnames'
import React from 'react'
import './card.scss'

export type CardProps = Readonly<{
  /**
   * The background color applied to the final rendering of the card.
   */
  readonly background?: 'primary' | 'secondary'
  /**
   * Content part, positioned in the center of the card.
   */
  readonly content?: Readonly<JSX.Element>
  /**
   * Footer part, positioned at the bottom of the card.
   */
  readonly footer?: Readonly<JSX.Element>
  /**
   * Header part, positioned at the top of the card.
   */
  readonly header?: Readonly<JSX.Element>
  /**
   * The size of the rendered card.
   */
  readonly size?: 'small' | 'medium' | 'large'
  /**
   * Whether card has a themed border.
   */
  readonly withBorder?: boolean
}>

export const Card: React.FC<CardProps> = ({
  background = 'primary',
  size = 'medium',
  withBorder = true,
  header,
  content,
  footer
}: CardProps): JSX.Element => {
  const wrapperClasses = classNames('okp4-card-main', {
    border: withBorder
  })
  const containerClasses = `okp4-card-container ${background} ${size}`
  return (
    <div className={wrapperClasses}>
      <div className={containerClasses}>
        <div>{header}</div>
        <div>{content}</div>
        <div>{footer}</div>
      </div>
    </div>
  )
}
