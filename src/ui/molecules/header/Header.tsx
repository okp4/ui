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
   * The list of navigable links that make up the menu.
   */
  readonly navigationMenu?: JSX.Element[]
}

const BurgerMenu = ({
  isOpened,
  onToggle
}: DeepReadonly<{ isOpened: boolean; onToggle: () => void }>): JSX.Element => (
  <div
    className={classNames(
      'okp4-header-navigation-burger-menu',
      isOpened ? 'rotate-down' : 'rotate-up'
    )}
    onClick={onToggle}
  >
    <Icon name="menu" size={38} />
  </div>
)

const BurgerMenuList = ({
  navigation
}: DeepReadonly<{ navigation: JSX.Element[] }>): JSX.Element => (
  <div className="okp4-header-navigation-burger-menu-list">
    {navigation.map((link: Readonly<JSX.Element>, index: number) => (
      <div className="okp4-header-navigation-burger-menu-item" key={index}>
        {link}
      </div>
    ))}
  </div>
)

const RowMenuList = ({ navigation }: DeepReadonly<{ navigation: JSX.Element[] }>): JSX.Element => (
  <div className="okp4-header-navigation-row-list">
    {navigation.map((link: Readonly<JSX.Element>, index: number) => (
      <div className="okp4-header-navigation-row-item" key={index}>
        {link}
      </div>
    ))}
  </div>
)

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
  const [isBurgerMenuOpened, setIsBurgerMenuOpened]: UseState<boolean> = useState<boolean>(false)
  const displayHeaderWithBurgerMenu = useMediaType('(max-width: 995px)')

  const showBurgerMenuList = displayHeaderWithBurgerMenu && isBurgerMenuOpened
  const headerClassname = classNames(
    'okp4-header-main',
    navigationMenu ? 'with-navigation' : 'without-navigation',
    {
      'burger-list': showBurgerMenuList
    }
  )

  const toggleBurgerMenu = useCallback((): void => {
    setIsBurgerMenuOpened(!isBurgerMenuOpened)
  }, [isBurgerMenuOpened, setIsBurgerMenuOpened])

  return (
    <div className={headerClassname}>
      {navigationMenu ? (
        <>
          {displayHeaderWithBurgerMenu && (
            <BurgerMenu isOpened={isBurgerMenuOpened} onToggle={toggleBurgerMenu} />
          )}
          {showBurgerMenuList && <BurgerMenuList navigation={navigationMenu} />}
          <FirstElement firstElement={firstElement} hasBurger={displayHeaderWithBurgerMenu} />
          {!displayHeaderWithBurgerMenu && <RowMenuList navigation={navigationMenu} />}
          <ThemeSwitcher />
        </>
      ) : (
        <>
          <FirstElement firstElement={firstElement} />
          <ThemeSwitcher className="without-navigation" />
        </>
      )}
    </div>
  )
}
