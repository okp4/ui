import React from 'react'
import './header.scss'
import { ThemeSwitcher } from 'ui/atoms/theme/ThemeSwitcher'
import type { DeepReadonly } from 'superTypes'
import { useBreakpoint } from 'hook/useBreakpoint'
import type { Breakpoints } from 'hook/useBreakpoint'
import classNames from 'classnames'

export type HeaderProps = {
  /**
   * Element positioned first in the reading flow.
   */
  readonly firstElement: JSX.Element
}

export const Header: React.FC<HeaderProps> = ({
  firstElement
}: DeepReadonly<HeaderProps>): JSX.Element => {
  const { isXSmall }: Breakpoints = useBreakpoint()
  const containerClass = classNames('okp4-header-first-element-container', isXSmall && 'x-small')

  return (
    <div className="okp4-header-main">
      <div className={containerClass}>{firstElement}</div>
      <div className="okp4-header-theme-switcher-container">
        <ThemeSwitcher />
      </div>
    </div>
  )
}
