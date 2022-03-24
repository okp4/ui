import classNames from 'classnames'
import React, { useCallback } from 'react'

import DarkLogo from '../../../../assets/logos/logo-okp4-dark.svg'
import LightLogo from '../../../../assets/logos/logo-okp4-light.svg'
import LightSlogan from '../../../../assets/logos/slogan-okp4-light.svg'
import DarkSlogan from '../../../../assets/logos/slogan-okp4-dark.svg'
import LightLogotype from '../../../../assets/logos/logotype-okp4-light.svg'
import DarkLogotype from '../../../../assets/logos/logotype-okp4-dark.svg'
import LightLogomark from '../../../../assets/logos/logomark-okp4-light.svg'
import DarkLogomark from '../../../../assets/logos/logomark-okp4-dark.svg'

import styles from './Logo.module.scss'

export type TLogoProps = Readonly<{
  /**
   * The size of the logo, must be determined according to its use and location.
   */
  readonly size?: 'small' | 'medium' | 'large'
  /**
   * The contrast of the logo, depending on the theme used.
   */
  readonly theme?: 'light' | 'dark'
  /**
   * The variant of the logo, flexible according to use and location.
   * By default, the standalone logo including the logotype, the logomark and the slogan..
   */
  readonly variant?: 'logo' | 'logotype' | 'logomark' | 'slogan'
}>

export const Logo: React.FC<TLogoProps> = ({
  size = 'medium',
  theme = 'dark',
  variant = 'logo'
}: TLogoProps) => {
  const getElementToRender = useCallback((): string => {
    switch (variant) {
      case 'logo':
        return theme === 'dark' ? DarkLogo : LightLogo
      case 'slogan':
        return theme === 'dark' ? DarkSlogan : LightSlogan
      case 'logotype':
        return theme === 'dark' ? DarkLogotype : LightLogotype
      case 'logomark':
        return theme === 'dark' ? DarkLogomark : LightLogomark
    }
  }, [variant, theme])

  const imageClassname = classNames(styles.core, {
    [styles.small]: size === 'small',
    [styles.medium]: size === 'medium',
    [styles.large]: size === 'large',
    [styles.logo]: variant === 'logo',
    [styles.logotype]: variant === 'logotype',
    [styles.logomark]: variant === 'logomark',
    [styles.slogan]: variant === 'slogan'
  })
  const imageSrc = getElementToRender()

  return <img className={imageClassname} src={imageSrc} />
}
