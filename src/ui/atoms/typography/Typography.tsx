import classNames from 'classnames'
import React from 'react'
import type { DeepReadonly } from '../../../superTypes'
import './typography.scss'
import '../../styles/main.scss'

export type TypographyProps = DeepReadonly<{
  /**
   * Prop used to switch out what's being ultimately rendered.
   */
  readonly as?: 'div' | 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'pre' | 'ul' | 'li'
  /**
   * The size of the rendered typography.
   */
  readonly fontSize?: 'x-large' | 'large' | 'medium' | 'small' | 'x-small'
  /**
   * `brand` (Gotham) is the main font for OKP4 branding,
   * therefore it is mainly used for all UI interfaces.
   * The `secondary` font is Noto Sans Mono.
   */
  readonly fontFamily?: 'brand' | 'secondary'
  /**
   * The different font weights declared for each font-family.
   */
  readonly fontWeight?: 'xlight' | 'light' | 'bold' | 'black'
  /**
   * The color applied to the final rendering of the typography,
   * regarding the current theme and following semantic color naming.
   */
  readonly color?:
    | 'text'
    | 'inverted-text'
    | 'highlighted-text'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
  /**
   * Handles the `white-space` property in the element.
   * If true, the text will not wrap, but instead will truncate with a text overflow ellipsis.
   */
  readonly noWrap?: boolean
  /**
   * The elements passed as children of the Typography component.
   * As an example, directly the text itself.
   */
  readonly children: React.ReactNode
}>

export const Typography: React.FC<TypographyProps> = ({
  as = 'span',
  noWrap = false,
  fontWeight = 'light',
  fontFamily = 'brand',
  color = 'text',
  fontSize = 'medium',
  children,
  ...props
}: TypographyProps): JSX.Element => {
  const typographyClass = classNames(`okp4-typography-main okp4-font-size-${fontSize}`, {
    [`text-color-${color}`]: true,
    'text-wrap-disabled': !!noWrap,
    [`${fontFamily}-${fontWeight}`]: true
  })
  return React.createElement(as, { ...props, className: typographyClass }, children)
}
