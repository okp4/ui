import React from 'react'
import './header.scss'
import { Logo } from '../../atoms/logo/Logo'
import { ThemeSwitcher } from 'ui/atoms/theme/ThemeSwitcher'
import type { Breakpoints } from 'hook/useBreakpoint'
import { useBreakpoint } from 'hook/useBreakpoint'

export const Header: React.FC = (): JSX.Element => {
  const { isXSmall }: Breakpoints = useBreakpoint()

  return (
    <div className={`okp4-header-main`}>
      <div className="okp4-header-logo-container">
        <Logo size={isXSmall ? 'small' : 'medium'} />
      </div>
      <div className="okp4-header-theme-switcher-container">
        <ThemeSwitcher />
      </div>
    </div>
  )
}
