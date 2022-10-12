import React, { useCallback, useEffect, useState } from 'react'
import type { DeepReadonly, UseState } from 'superTypes'
import classNames from 'classnames'
import { useMediaType } from 'hook/useMediaType'
import { ThemeSwitcher as Switcher } from 'ui/atoms/theme/ThemeSwitcher'
import { Icon } from 'ui/atoms/icon/Icon'
import './header.scss'

export type HeaderProps = {
  /**
   * Element positioned first in the reading flow.
   */
  readonly firstElement?: JSX.Element
  /**
   * The list of navigable links that make up the menu.
   */
  readonly navigationMenu?: JSX.Element[]
}

const BurgerMenu = ({
  isOpen,
  onToggle
}: DeepReadonly<{ isOpen: boolean; onToggle: () => void }>): JSX.Element => (
  <div
    className={classNames(
      'okp4-header-navigation-burger-menu',
      isOpen ? 'rotate-down' : 'rotate-up'
    )}
    onClick={onToggle}
  >
    <Icon name="menu" size={38} />
  </div>
)

const NavigationMenu = ({
  navigation,
  withBurgerMenu
}: DeepReadonly<{ navigation: JSX.Element[]; withBurgerMenu?: boolean }>): JSX.Element => {
  const menuType = withBurgerMenu ? 'burger' : 'row'
  return (
    <div className={`okp4-header-navigation-${menuType}-list`}>
      {navigation.map((link: DeepReadonly<JSX.Element>, index: number) => (
        <div className={`okp4-header-navigation-${menuType}-item`} key={index}>
          {link}
        </div>
      ))}
    </div>
  )
}

const FirstElement = ({
  firstElement,
  hasBurger
}: DeepReadonly<{
  firstElement: JSX.Element
  hasBurger?: boolean
}>): JSX.Element => (
  <div
    className={classNames('okp4-header-first-element', {
      'with-burger': hasBurger
    })}
  >
    {firstElement}
  </div>
)

const ThemeSwitcher = ({ className }: DeepReadonly<{ className?: string }>): JSX.Element => (
  <div className={classNames('okp4-header-theme-switcher-container', className)}>
    <Switcher />
  </div>
)

export const Header: React.FC<HeaderProps> = ({
  firstElement,
  navigationMenu
}: DeepReadonly<HeaderProps>): JSX.Element => {
  const [isBurgerMenuOpen, setIsBurgerMenuOpen]: UseState<boolean> = useState<boolean>(false)
  const isSmallScreen = useMediaType('(max-width: 995px)')

  const showBurgerMenu = isSmallScreen && !!navigationMenu
  const showRowMenu = !isSmallScreen && !!navigationMenu
  const showBurgerMenuList = showBurgerMenu && isBurgerMenuOpen

  const headerClassname = classNames('okp4-header-main', {
    'with-first-element': firstElement && !navigationMenu,
    'with-navigation': !firstElement && navigationMenu,
    'with-first-element-and-navigation': firstElement && navigationMenu,
    'burger-list': showBurgerMenuList
  })

  const toggleBurgerMenu = useCallback((): void => {
    setIsBurgerMenuOpen(!isBurgerMenuOpen)
  }, [isBurgerMenuOpen])

  useEffect(() => {
    if (!isSmallScreen) setIsBurgerMenuOpen(false)
  }, [isSmallScreen])

  return (
    <div className={headerClassname}>
      {showBurgerMenu && <BurgerMenu isOpen={isBurgerMenuOpen} onToggle={toggleBurgerMenu} />}
      {showBurgerMenuList && <NavigationMenu navigation={navigationMenu} withBurgerMenu />}
      {firstElement && <FirstElement firstElement={firstElement} hasBurger={showBurgerMenu} />}
      {showRowMenu && <NavigationMenu navigation={navigationMenu} />}
      <ThemeSwitcher className={classNames({ 'with-navigation': !!navigationMenu })} />
    </div>
  )
}
