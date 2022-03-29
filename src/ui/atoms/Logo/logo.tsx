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

import './logo.scss'

export type TLogoProps = Readonly<{
  /**
   * The size of the logo, must be determined according to its use and location.
   */
  readonly size?: 'small' | 'medium' | 'large'
  /**
   * The variant of the logo, depending on the theme used.
   */
  readonly variant?: 'light' | 'dark'
  /**
   * The type of the logo, flexible according to use and location.
   * By default, the standalone logo including the logotype, the logomark and the slogan..
   */
  readonly type?: 'logo' | 'logotype' | 'logomark' | 'slogan'
}>

export const Logo: React.FC<TLogoProps> = ({
  size = 'medium',
  variant = 'dark',
  type = 'logo'
}: TLogoProps) => {
  const getElementToRender = useCallback((): string => {
    switch (type) {
      case 'logo':
        return variant === 'dark' ? DarkLogo : LightLogo
      case 'slogan':
        return variant === 'dark' ? DarkSlogan : LightSlogan
      case 'logotype':
        return variant === 'dark' ? DarkLogotype : LightLogotype
      case 'logomark':
        return variant === 'dark' ? DarkLogomark : LightLogomark
    }
  }, [variant, type])

  const imageClassname = classNames('okp4-logo-main', {
    small: size === 'small',
    medium: size === 'medium',
    large: size === 'large',
    logo: type === 'logo',
    logotype: type === 'logotype',
    logomark: type === 'logomark',
    slogan: type === 'slogan'
  })
  const imageSrc = getElementToRender()

  return <img className={imageClassname} src={imageSrc} />
}
