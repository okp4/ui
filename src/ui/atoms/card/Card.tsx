import classNames from 'classnames'
import React from 'react'
import './card.scss'

export type CardProps = Readonly<{
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
  readonly background?: 'primary' | 'secondary'
  /**
   * Whether card has a border
   */
  readonly withBorder?: boolean
}>

/**
 * Primary UI component for user interaction.
 */
export const Card: React.FC<CardProps> = ({
  size = 'large',
  withBorder,
  header,
  content,
  footer,
  background
}: CardProps): JSX.Element => {
  const wrapperClasses = classNames(`okp4-card-main ${size}`, {
    border: withBorder
  })
  const containerClasses = `okp4-card-container ${background} ${size}`
  const contentClasses = `okp4-card-content ${size}`
  return (
    <div className={wrapperClasses}>
      <div className={containerClasses}>
        <div>{header}</div>
        <div className={contentClasses}>{content}</div>
        <div>{footer}</div>
      </div>
    </div>
  )
}
