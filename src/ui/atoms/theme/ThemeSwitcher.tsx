import React, { useCallback, useEffect } from 'react'
import * as Switch from '@radix-ui/react-switch'
import MoonIcon from '../../../assets/icons/moonIcon.svg'
import SunIcon from '../../../assets/icons/sunIcon.svg'
import type { Theme, ThemeContextType } from './themeContext'
import { useTheme } from 'hooks/useTheme'
import './themeSwitcher.scss'

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme }: ThemeContextType = useTheme()
  const isDarkTheme = theme === 'dark'

  const saveTheme = useCallback(
    (newTheme: Theme): void => {
      setTheme(newTheme)
      localStorage.setItem('okp4UserTheme', newTheme)
    },
    [setTheme]
  )

  const handleCheck = useCallback(
    (checked: boolean): void => {
      saveTheme(checked ? 'dark' : 'light')
    },
    [saveTheme]
  )

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      saveTheme('dark')
      return
    }
    const loadedTheme = localStorage.getItem('userTheme')
    if (loadedTheme && loadedTheme === 'dark') {
      saveTheme(loadedTheme)
    }
  }, [saveTheme, setTheme])

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
