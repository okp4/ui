import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { DeepReadonly, UseState } from 'superTypes'
import classNames from 'classnames'
import short from 'short-uuid'
import { useMediaType } from 'hook/useMediaType'
import { ThemeSwitcher as Switcher } from 'ui/atoms/theme/ThemeSwitcher'
import { Icon } from 'ui/atoms/icon/Icon'
import './header.scss'

export type NavigationItem = {
  menuItem: JSX.Element
  subMenu?: NavigationItem[]
  isSelectedFromStart?: boolean
}

export type HeaderProps = {
  /**
   * Element positioned first in the reading flow.
   */
  readonly firstElement: JSX.Element
  /**
   * The list of navigable links that make up the menu.
   */
  readonly navigationMenu?: NavigationItem[]
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
}: DeepReadonly<{ navigation: NavigationItem[]; withBurgerMenu?: boolean }>): JSX.Element => {
  const [selectedMenuItemId, setSelectedMenuItemID]: UseState<string> = useState<string>('')
  const menuType = withBurgerMenu ? 'burger' : 'row'

  const menuItemsWithIds: Map<string, DeepReadonly<NavigationItem>> = useMemo(
    () =>
      new Map(
        navigation.map((navItem: DeepReadonly<NavigationItem>) => {
          const id = short.generate()
          navItem.isSelectedFromStart && setSelectedMenuItemID(id)
          return [id, navItem]
        })
      ),
    [navigation]
  )

  const handleMenuItemSelected = useCallback(
    (id: string) => (): void => {
      setSelectedMenuItemID(id)
    },
    []
  )

  return (
    <div className={`okp4-header-navigation-${menuType}-list`}>
      {[...menuItemsWithIds].map(
        ([id, navItem]: DeepReadonly<[string, DeepReadonly<NavigationItem>]>) => {
          const showSelected = selectedMenuItemId === id && menuType === 'row'
          return (
            <div
              className={classNames(`okp4-header-navigation-${menuType}-item`, {
                selected: showSelected
              })}
              key={id}
              onClick={handleMenuItemSelected(id)}
            >
              {showSelected && <Icon name="arrow-down" size={15} />}
              {navItem.menuItem}
              {showSelected && <Icon name="arrow-up" size={15} />}
            </div>
          )
        }
      )}
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

  const headerClassname = classNames(
    'okp4-header-main',
    navigationMenu ? 'with-navigation' : 'without-navigation',
    {
      'burger-list': showBurgerMenuList
    }
  )

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
      <FirstElement firstElement={firstElement} hasBurger={showBurgerMenu} />
      {showRowMenu && <NavigationMenu navigation={navigationMenu} />}
      <ThemeSwitcher className={classNames({ 'with-navigation': !!navigationMenu })} />
    </div>
  )
}
