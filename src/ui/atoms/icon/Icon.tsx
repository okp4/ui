import React from 'react'
import type { DeepReadonly } from 'superTypes'
import { useTheme } from 'hook/useTheme'
import type { ThemeContextType } from 'context/themeContext'
import sprite from '../../../assets/icons/sprite.svg'

export type ThemedIcon =
  | 'active-menu'
  | 'add'
  | 'alert'
  | 'arrow'
  | 'chat'
  | 'meeting'
  | 'next'
  | 'podcast'
  | 'previous'
  | 'profile'
  | 'rs-facebook'
  | 'rs-linkedin'
  | 'rs-twitter'
  | 'search'
  | 'theme-switcher'
  | 'wallet'

export type IconProps = {
  /**
   * Icon name to use.
   */
  readonly name: ThemedIcon
  /**
   * Icon size in pixels, squared.
   */
  readonly size?: number
  /**
   * Class name allowing for custom styling.
   */
  readonly className?: string
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 30,
  className
}: DeepReadonly<IconProps>): JSX.Element => {
  const { theme }: ThemeContextType = useTheme()

  const SVG = (
    <svg height={`${size}px`} width={`${size}px`}>
      <use href={`${sprite}#${name}-${theme}`} />
    </svg>
  )

  return className ? <div className={className}>{SVG}</div> : SVG
}
