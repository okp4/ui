import React, { useCallback } from 'react'
import * as Switch from '@radix-ui/react-switch'
import MoonIcon from '../../../assets/icons/moonIcon.svg'
import SunIcon from '../../../assets/icons/sunIcon.svg'
import type { ThemeContextType } from './themeContext'
import { useTheme } from 'hooks/useTheme'
import './themeSwitcher.scss'

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme }: ThemeContextType = useTheme()
  const isDarkTheme = theme === 'dark'

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

  const switchIcon = isDarkTheme ? <SunIcon /> : <MoonIcon />

  return (
    <Switch.Root
      checked={theme === 'dark'}
      className="okp4-theme-switcher-main"
      onCheckedChange={handleCheck}
    >
      <div className={`okp4-theme-switcher-icon ${theme}`}>{switchIcon}</div>
      <Switch.Thumb className="okp4-theme-switcher-thumb" />
    </Switch.Root>
  )
}
