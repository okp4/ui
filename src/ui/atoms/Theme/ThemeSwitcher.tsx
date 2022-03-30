import React, { useCallback } from 'react'
import * as Switch from '@radix-ui/react-switch'

import type { ThemeContextType } from './themeContext'
import { useTheme } from './useTheme'
import './themeSwitcher.scss'

export const ThemeSetter: React.FC = () => {
  const { theme, setTheme }: ThemeContextType = useTheme()

  const handleCheck = useCallback(
    (checked: boolean): void => {
      if (checked) {
        setTheme('dark')
      } else {
        setTheme('light')
      }
    },
    [setTheme]
  )

  return (
    <Switch.Root
      checked={theme === 'dark'}
      className="okp4-theme-switcher-main"
      onCheckedChange={handleCheck}
    >
      <Switch.Thumb className="okp4-theme-switcher-thumb" />
    </Switch.Root>
  )
}
