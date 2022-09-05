import React, { useCallback, useState } from 'react'
import './withNavigation.scss'
import { useMediaType } from 'hook/useMediaType'
import type { DeepReadonly, UseState } from 'superTypes'
import { ThemeSwitcher } from 'ui/atoms/theme/ThemeSwitcher'
import { Icon } from 'ui/atoms/icon/Icon'
import classNames from 'classnames'

type HeaderWithNavProps = {
  readonly firstElement: JSX.Element
  readonly navigationMenu: JSX.Element[]
  readonly containerClass: string
}

export const WithNavigation = ({
  firstElement,
  containerClass,
  navigationMenu
}: DeepReadonly<HeaderWithNavProps>): JSX.Element => {
  const [open, setOpen]: UseState<boolean> = useState<boolean>(false)
  const displayBurgerMenu = useMediaType('(max-width: 995px)')
  const showBurgerList = displayBurgerMenu && open
  const handleMenuOpen = useCallback((): void => {
    setOpen(!open)
  }, [open, setOpen])

  return (
    <div
      className={classNames('okp4-header-main-with-nav', {
        'burger-list': showBurgerList
      })}
    >
      {displayBurgerMenu && (
        <div className="okp4-header-navigation-burger-menu" onClick={handleMenuOpen}>
          <Icon name="arrow-down" />
        </div>
      )}
      <div className={containerClass}>{firstElement}</div>
      {!displayBurgerMenu && (
        <div className="okp4-header-navigation-menu-container">
          {navigationMenu.map((link: Readonly<JSX.Element>) => (
            <div className="okp4-header-navigation-menu-item" key={link.key}>
              {link}
            </div>
          ))}
        </div>
      )}
      <div className="okp4-header-theme-switcher-container">
        <ThemeSwitcher />
      </div>
      {showBurgerList && (
        <div className="okp4-header-burger-menu-list">
          {navigationMenu.map((link: Readonly<JSX.Element>) => (
            <div className="okp4-header-burger-menu-link" key={link.key}>
              {link}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
