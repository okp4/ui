import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import short from 'short-uuid'
import type { DeepReadonly, UseState } from 'superTypes'
import { useMediaType } from 'hook/useMediaType'
import { useOnKeyboard } from 'hook/useOnKeyboard'
import { useOnClickOutside } from 'hook/useOnClickOutside'
import { ThemeSwitcher as Switcher } from 'ui/atoms/theme/ThemeSwitcher'
import { Typography } from 'ui/atoms/typography/Typography'
import { Icon } from 'ui/atoms/icon/Icon'
import './header.scss'

type NavigationItemsWithId = DeepReadonly<Map<string, NavigationItem>>

export type NavigationMenuProps = {
  navigation: NavigationItemsWithId
  onNavItemSelection: (id: string, isSubItem?: boolean) => void
  selectedNavItem?: string
  withBurgerMenu?: boolean
}

export type NavigationItem = {
  menuItem: JSX.Element
  subMenu?: JSX.Element[]
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

const NavItem = ({
  isItemSelected,
  isRow,
  item
}: DeepReadonly<{
  isItemSelected: boolean
  isRow: boolean
  item: JSX.Element
}>): JSX.Element => (
  <>
    {isItemSelected && <Icon name={isRow ? 'arrow-down' : 'arrow-right'} size={15} />}
    {item}
    {isItemSelected && isRow && <Icon name="arrow-up" size={15} />}
  </>
)

const SubMenu = ({
  onSubItemSelection,
  subMenu
}: DeepReadonly<{
  onSubItemSelection: () => void
  subMenu: JSX.Element[]
}>): JSX.Element => (
  <div className="okp4-header-navigation-submenu">
    {subMenu.map((navItem: DeepReadonly<JSX.Element>, index: number) => (
      <div className="okp4-header-navigation-submenu-item" key={index} onClick={onSubItemSelection}>
        <Typography fontSize="x-small" noWrap>
          {navItem}
        </Typography>
      </div>
    ))}
  </div>
)

// eslint-disable-next-line max-lines-per-function
const NavigationMenu = ({
  navigation,
  onNavItemSelection,
  selectedNavItem = '',
  withBurgerMenu
}: DeepReadonly<NavigationMenuProps>): JSX.Element => {
  const [subMenuOpen, setSubMenuOpen]: UseState<boolean> = useState<boolean>(false)
  const menuType = withBurgerMenu ? 'burger' : 'row'
  const navItemRef = useRef<HTMLDivElement | null>(null)

  const closeSubMenu = useCallback(() => {
    setSubMenuOpen(false)
  }, [])

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  useOnKeyboard((event: DeepReadonly<KeyboardEvent>): void => {
    if (event.key === 'Escape') {
      setSubMenuOpen(false)
    }
  })

  useOnClickOutside(navItemRef, closeSubMenu)

  const handleMenuItemSelected = useCallback(
    (id: string, hasMenu: boolean) => (): void => {
      if (selectedNavItem === id) {
        hasMenu && setSubMenuOpen(!subMenuOpen)
      } else {
        onNavItemSelection(id, hasMenu)
        setSubMenuOpen(hasMenu)
      }
    },
    [subMenuOpen, selectedNavItem, onNavItemSelection]
  )

  const handleSubMenuItemSelected = useCallback(() => {
    onNavItemSelection(selectedNavItem, false)
    setSubMenuOpen(false)
  }, [onNavItemSelection, selectedNavItem])

  return (
    <div className={`okp4-header-navigation-${menuType}-list`} ref={navItemRef}>
      {[...navigation].map(([id, navItem]: DeepReadonly<[string, NavigationItem]>) => {
        const { menuItem, subMenu }: DeepReadonly<NavigationItem> = navItem
        const isSelected = selectedNavItem === id
        const showSubMenu = isSelected && subMenu && subMenuOpen

        return (
          <div className="okp4-header-navigation-item-container" key={id}>
            <div
              className={classNames(`okp4-header-navigation-${menuType}-item`, {
                selected: isSelected
              })}
              onClick={handleMenuItemSelected(id, !!subMenu)}
            >
              <NavItem isItemSelected={isSelected} isRow={menuType === 'row'} item={menuItem} />
            </div>
            {showSubMenu && (
              <SubMenu onSubItemSelection={handleSubMenuItemSelected} subMenu={subMenu} />
            )}
          </div>
        )
      })}
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
/* eslint-disable max-lines-per-function */
export const Header: React.FC<HeaderProps> = ({
  firstElement,
  navigationMenu
}: DeepReadonly<HeaderProps>): JSX.Element => {
  const [isBurgerMenuOpen, setIsBurgerMenuOpen]: UseState<boolean> = useState<boolean>(false)
  const [selectedNavItem, setSelectedNavItem]: UseState<string> = useState<string>('')

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

  const navItemsWithId: NavigationItemsWithId = useMemo(
    () =>
      new Map(
        navigationMenu?.map((navItem: DeepReadonly<NavigationItem>) => {
          const id = short.generate()
          navItem.isSelectedFromStart && setSelectedNavItem(id)
          return [id, navItem]
        })
      ),
    [navigationMenu]
  )

  const toggleBurgerMenu = useCallback((): void => {
    setIsBurgerMenuOpen(!isBurgerMenuOpen)
  }, [isBurgerMenuOpen])

  const handleNavItemSelection = useCallback(
    (id: string, isSubMenuTitle?: boolean): void => {
      setSelectedNavItem(id)
      !isSubMenuTitle && isSmallScreen && setIsBurgerMenuOpen(false)
    },
    [isSmallScreen]
  )

  useEffect(() => {
    if (!isSmallScreen) setIsBurgerMenuOpen(false)
  }, [isSmallScreen])

  return (
    <header className={headerClassname}>
      {showBurgerMenu && <BurgerMenu isOpen={isBurgerMenuOpen} onToggle={toggleBurgerMenu} />}
      {showBurgerMenuList && (
        <NavigationMenu
          navigation={navItemsWithId}
          onNavItemSelection={handleNavItemSelection}
          selectedNavItem={selectedNavItem}
          withBurgerMenu
        />
      )}
      <FirstElement firstElement={firstElement} hasBurger={showBurgerMenu} />
      {showRowMenu && (
        <NavigationMenu
          navigation={navItemsWithId}
          onNavItemSelection={handleNavItemSelection}
          selectedNavItem={selectedNavItem}
        />
      )}
      <ThemeSwitcher className={classNames({ 'with-navigation': !!navigationMenu })} />
    </header>
  )
}
