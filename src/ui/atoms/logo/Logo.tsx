import classNames from 'classnames'
import React, { useCallback } from 'react'
import type { ThemeContextType } from 'context/themeContext'
import { useTheme } from 'hook/useTheme'
import DarkLogo from '../../../assets/logos/logo-okp4-dark.svg'
import LightLogo from '../../../assets/logos/logo-okp4-light.svg'
import LightSlogan from '../../../assets/logos/slogan-okp4-light.svg'
import DarkSlogan from '../../../assets/logos/slogan-okp4-dark.svg'
import LightLogotype from '../../../assets/logos/logotype-okp4-light.svg'
import DarkLogotype from '../../../assets/logos/logotype-okp4-dark.svg'
import LightLogomark from '../../../assets/logos/logomark-okp4-light.svg'
import DarkLogomark from '../../../assets/logos/logomark-okp4-dark.svg'

import './logo.scss'

export type TLogoProps = Readonly<{
  /**
   * The size of the logo, must be determined according to its use and location.
   */
  readonly size?: 'small' | 'medium' | 'large'
  /**
   * The type of the logo, flexible according to use and location.
   * By default, the standalone logo including the logotype, the logomark and the slogan..
   */
  readonly type?: 'logo' | 'logotype' | 'logomark' | 'slogan'
}>

export const Logo: React.FC<TLogoProps> = ({ size = 'medium', type = 'logo' }: TLogoProps) => {
  const { theme }: ThemeContextType = useTheme()

  const getElement = useCallback(() => {
    switch (type) {
      case 'logo':
        return theme === 'dark' ? DarkLogo : LightLogo
      case 'slogan':
        return theme === 'dark' ? DarkSlogan : LightSlogan
      case 'logotype':
        return theme === 'dark' ? DarkLogotype : LightLogotype
      case 'logomark':
        return theme === 'dark' ? DarkLogomark : LightLogomark
    }
  }, [theme, type])

  const imageClassname = classNames('okp4-logo-main', {
    small: size === 'small',
    medium: size === 'medium',
    large: size === 'large',
    logo: type === 'logo',
    logotype: type === 'logotype',
    logomark: type === 'logomark',
    slogan: type === 'slogan'
  })

  const Element = getElement()

  return <Element className={imageClassname} />
}
