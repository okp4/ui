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
  readonly background?: 'primary' | 'secondary' | 'header' | 'footer'
  /**
   * Whether card has a border
   */
  readonly withBorder?: boolean
}>

/**
 * Primary UI component for user interaction.
 */
export const Card: React.FC<CardProps> = ({
  size = 'medium',
  // background = 'primary',
  withBorder = true,
  header,
  content,
  footer
}: CardProps): JSX.Element => {
  // const isWithBorders = withBorder ? 'true' : 'false';
  // const classnames = classNames(
  //   'okp4-card-main', 
  //   {
  //     [`${background}-background-${isWithBorders}`]: true,
  //     "small": size == 'small',
  //     "medium": size == 'medium',
  //     "large": size == 'large',
  //   }
  // );
  const wrapperClasses = classNames(
    'okp4-card-wrapper',
    {
      "small": size === 'small',
      "medium": size === 'medium',
      "large": size === 'large',
      "border": withBorder,
    }
  );
  const containerClasses = classNames(
    'okp4-card-container',
    {
      "small": size === 'small',
      "medium": size === 'medium',
      "large": size === 'large',
    }
  );
  return (
    <div className={wrapperClasses}>
      <div className={containerClasses}>
        <div>{header}</div>
        <div>{content}</div>
        <div>{footer}</div>
      </div>
    </div>
  );
}
