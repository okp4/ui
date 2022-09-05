import React, { useCallback, useState } from 'react'
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
  readonly firstElement: JSX.Element
  /**
   * The list of navigable links that make up the menu
   */
  readonly navigationMenu?: JSX.Element[]
}

const BurgerMenu = ({
  isOpened,
  onBurgerMenuOpen
}: DeepReadonly<{ isOpened: boolean; onBurgerMenuOpen: () => void }>): JSX.Element => (
  <div
    className={classNames(
      'okp4-header-navigation-burger-menu',
      isOpened ? 'rotate-up' : 'rotate-down'
    )}
    onClick={onBurgerMenuOpen}
  >
    <Icon name="menu" />
  </div>
)

const BurgerMenuList = ({
  navigationMenu
}: DeepReadonly<{ navigationMenu: JSX.Element[] }>): JSX.Element => (
  <div className="okp4-header-navigation-burger-menu-list">
    {navigationMenu.map((link: Readonly<JSX.Element>, index: number) => (
      <div className="okp4-header-navigation-burger-menu-item" key={index}>
        {link}
      </div>
    ))}
  </div>
)

const RowMenuList = ({
  navigationMenu
}: DeepReadonly<{ navigationMenu: JSX.Element[] }>): JSX.Element => (
  <div className="okp4-header-navigation-menu-list">
    {navigationMenu.map((link: Readonly<JSX.Element>, index: number) => (
      <div className="okp4-header-navigation-menu-item" key={index}>
        {link}
      </div>
    ))}
  </div>
)

const ThemeSwitcher = (): JSX.Element => (
  <div className="okp4-header-theme-switcher-container">
    <Switcher />
  </div>
)

export const Header: React.FC<HeaderProps> = ({
  firstElement,
  navigationMenu
}: DeepReadonly<HeaderProps>): JSX.Element => {
  const [isMenuOpened, setIsMenuOpened]: UseState<boolean> = useState<boolean>(false)
  const showBurgerMenu = useMediaType('(max-width: 995px)')
  const showBurgerMenuList = showBurgerMenu && isMenuOpened
  const headerClassname = classNames(
    'okp4-header-main',
    navigationMenu ? 'with-navigation' : 'without-navigation',
    {
      'burger-list': showBurgerMenuList
    }
  )

  const handleBurgerMenuOpen = useCallback((): void => {
    setIsMenuOpened(!isMenuOpened)
  }, [isMenuOpened, setIsMenuOpened])

  return (
    <div className={headerClassname}>
      {navigationMenu ? (
        <>
          {showBurgerMenu && (
            <BurgerMenu isOpened={isMenuOpened} onBurgerMenuOpen={handleBurgerMenuOpen} />
          )}
          {showBurgerMenuList && <BurgerMenuList navigationMenu={navigationMenu} />}
          <div className="okp4-header-first-element-container">{firstElement}</div>
          {!showBurgerMenu && <RowMenuList navigationMenu={navigationMenu} />}
          <ThemeSwitcher />
        </>
      ) : (
        <>
          <div className="okp4-header-first-element-container">{firstElement}</div>
          <ThemeSwitcher />
        </>
      )}
    </div>
  )
}
