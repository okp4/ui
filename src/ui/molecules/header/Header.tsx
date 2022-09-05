import React from 'react'
import './header.scss'
import type { DeepReadonly } from 'superTypes'
import { useBreakpoint } from 'hook/useBreakpoint'
import type { Breakpoints } from 'hook/useBreakpoint'
import classNames from 'classnames'
import { WithNavigation } from './withNav/WithNavigation'
import { WithoutNavigation } from './withoutNav/WithoutNavigation'

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

export const Header: React.FC<HeaderProps> = ({
  firstElement,
  navigationMenu
}: DeepReadonly<HeaderProps>): JSX.Element => {
  const { isXSmall }: Breakpoints = useBreakpoint()
  const containerClass = classNames('okp4-header-first-element-container', isXSmall && 'x-small')

  return navigationMenu ? (
    <WithNavigation
      containerClass={containerClass}
      firstElement={firstElement}
      navigationMenu={navigationMenu}
    />
  ) : (
    <WithoutNavigation containerClass={containerClass} firstElement={firstElement} />
  )
}
