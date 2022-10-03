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

type NavigationItemsWithIds = DeepReadonly<Map<string, NavigationItem>>

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
}>): JSX.Element => {
  return (
    <div className="okp4-header-navigation-submenu">
      {subMenu.map((navItem: DeepReadonly<JSX.Element>) => (
        // eslint-disable-next-line react/jsx-key
        <div className="okp4-header-navigation-submenu-item" onClick={onSubItemSelection}>
          <Typography fontSize="x-small" noWrap>
            {navItem}
          </Typography>
        </div>
      ))}
    </div>
  )
}

// eslint-disable-next-line max-lines-per-function
const NavigationMenu = ({
  navigation,
  onNavItemSelection,
  startNavItem,
  withBurgerMenu
}: DeepReadonly<{
  navigation: NavigationItemsWithIds
  onNavItemSelection?: (id: string, isSubItem?: boolean) => void
  startNavItem?: string
  withBurgerMenu?: boolean
}>): JSX.Element => {
  const [selectedMenuItemId, setSelectedMenuItemID]: UseState<string> = useState<string>(
    startNavItem ?? ''
  )
  const [isSubMenuOpen, setIsSubMenuOpen]: UseState<boolean> = useState<boolean>(false)
  const menuType = withBurgerMenu ? 'burger' : 'row'

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  useOnKeyboard((event: DeepReadonly<KeyboardEvent>): void => {
    if (event.key === 'Escape') {
      setIsSubMenuOpen(false)
    }
  })

  const handleMenuItemSelected = useCallback(
    (id: string, subMenu?: DeepReadonly<JSX.Element[]>) => (): void => {
      if (selectedMenuItemId === id) {
        subMenu && setIsSubMenuOpen(!isSubMenuOpen)
      }
      if (selectedMenuItemId !== id) {
        setSelectedMenuItemID(id)
        setIsSubMenuOpen(!!subMenu)
      }
      onNavItemSelection?.(id)
    },
    [selectedMenuItemId, onNavItemSelection, isSubMenuOpen]
  )

  const handleSubItemSelection = useCallback(() => {
    setIsSubMenuOpen(false)
    onNavItemSelection?.(selectedMenuItemId, true)
  }, [onNavItemSelection, selectedMenuItemId])

  const closeSubMenuOnClickOutside = useCallback(() => {
    setIsSubMenuOpen(false)
  }, [])

  const navItemRef = useRef(null)
  useOnClickOutside(navItemRef, closeSubMenuOnClickOutside)

  useEffect(() => {
    console.log({ selectedMenuItemId })
    setSelectedMenuItemID(
      selectedMenuItemId ? selectedMenuItemId : startNavItem ? startNavItem : ''
    )
  }, [selectedMenuItemId, startNavItem])

  return (
    <div className={`okp4-header-navigation-${menuType}-list`} ref={navItemRef}>
      {[...navigation].map(([id, navItem]: DeepReadonly<[string, NavigationItem]>) => {
        const { menuItem, subMenu }: DeepReadonly<NavigationItem> = navItem
        const isSelected = selectedMenuItemId === id
        const showSubMenu = isSelected && isSubMenuOpen && subMenu

        return (
          <div className="okp4-header-navigation-item-container" key={id}>
            <div
              className={classNames(`okp4-header-navigation-${menuType}-item`, {
                selected: isSelected
              })}
              onClick={handleMenuItemSelected(id, subMenu)}
            >
              <NavItem isItemSelected={isSelected} isRow={menuType === 'row'} item={menuItem} />
            </div>
            {showSubMenu && (
              <SubMenu onSubItemSelection={handleSubItemSelection} subMenu={subMenu} />
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

  const toggleBurgerMenu = useCallback((): void => {
    setIsBurgerMenuOpen(!isBurgerMenuOpen)
  }, [isBurgerMenuOpen])

  const handleNavItemSelection = useCallback(
    (id: string, isSubItem?: boolean): void => {
      setSelectedNavItem(id)
      isSubItem && isSmallScreen && setIsBurgerMenuOpen(false)
    },
    [isSmallScreen]
  )

  const navItemsWithIds: NavigationItemsWithIds = useMemo(() => {
    return new Map(
      navigationMenu?.map((navItem: DeepReadonly<NavigationItem>) => {
        const id = short.generate()
        navItem.isSelectedFromStart && setSelectedNavItem(id)
        return [id, navItem]
      })
    )
  }, [navigationMenu])

  useEffect(() => {
    if (!isSmallScreen) setIsBurgerMenuOpen(false)
  }, [isSmallScreen])

  return (
    <div className={headerClassname}>
      {showBurgerMenu && <BurgerMenu isOpen={isBurgerMenuOpen} onToggle={toggleBurgerMenu} />}
      {showBurgerMenuList && (
        <NavigationMenu
          navigation={navItemsWithIds}
          onNavItemSelection={handleNavItemSelection}
          startNavItem={selectedNavItem}
          withBurgerMenu
        />
      )}
      <FirstElement firstElement={firstElement} hasBurger={showBurgerMenu} />
      {showRowMenu && (
        <NavigationMenu
          navigation={navItemsWithIds}
          onNavItemSelection={handleNavItemSelection}
          startNavItem={selectedNavItem}
        />
      )}
      <ThemeSwitcher className={classNames({ 'with-navigation': !!navigationMenu })} />
    </div>
  )
}
