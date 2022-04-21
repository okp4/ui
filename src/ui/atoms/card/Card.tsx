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
  size = 'medium',
  background = 'primary',
  withBorder = false,
  header,
  content,
  footer,
  ...props
}: TCardProps): JSX.Element => {
  const bordersColor = withBorder ? 'white' : 'transparent';
  const classnames = classNames(
    'okp4-card-main okp4-card-beveled', 
    {
      [`okp4-card-beveled-${background}-background-${bordersColor}`]: true,
      "okp4-card-small": size == 'small',
      "okp4-card-medium": size == 'medium',
      "okp4-card-large": size == 'large',
      "okp4-card-with-border": withBorder,
    }
  );
  return (
    <div
      className={classnames}
      {...props}
    >
      {header}
      {content}
      {footer}
    </div>
  );
}
