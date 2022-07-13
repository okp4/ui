import classNames from 'classnames'
import React from 'react'
import type { ThemeContextType } from 'context/themeContext'
import { useTheme } from 'hook/useTheme'
import sprite from '../../../assets/logos/sprite.svg'
import './logo.scss'

export type LogoProps = Readonly<{
  /**
   * The size of the logo, must be determined according to its use and location.
   */
  readonly size?: 'small' | 'medium' | 'large'
  /**
   * The type of the logo, flexible according to use and location.
   */
  readonly type?: 'logo' | 'logotype' | 'logomark' | 'slogan'
}>

export const Logo: React.FC<LogoProps> = ({ size = 'medium', type = 'logo' }: LogoProps) => {
  const { theme }: ThemeContextType = useTheme()

  const imageClassname = classNames('okp4-logo-main', {
    small: size === 'small',
    medium: size === 'medium',
    large: size === 'large',
    logo: type === 'logo',
    logotype: type === 'logotype',
    logomark: type === 'logomark',
    slogan: type === 'slogan'
  })

  return (
    <svg className={imageClassname}>
      <use href={`${sprite}#${type}-okp4-${theme}`} />
    </svg>
  )
}
