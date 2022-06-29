import React, { useCallback, useEffect } from 'react'
import * as Switch from '@radix-ui/react-switch'
import MoonIcon from '../../../assets/icons/moonIcon.svg'
import SunIcon from '../../../assets/icons/sunIcon.svg'
import type { ThemeContextType } from 'context/themeContext'
import { useTheme } from 'hook/useTheme'
import './themeSwitcher.scss'
import { useLocalStorage } from 'hook/useLocalStorage'
import type { LocalStorageState } from 'hook/useLocalStorage'
import { useMediaType } from 'hook/useMediaType'

export type ThemeSwitcherProps = Readonly<{
  /**
   * Tells if the theme should be saved to (and restored from) the local storage.
   */
  readonly saveToLocalStorage?: boolean
  /**
   * The key to use for fetching the theme from the local storage.
   */
  readonly localStorageKey?: string
}>

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  localStorageKey = 'okp4-theme',
  saveToLocalStorage = true
}: ThemeSwitcherProps) => {
  const { theme, setTheme }: ThemeContextType = useTheme()
  const [value, setValue]: LocalStorageState = useLocalStorage(localStorageKey)
  const prefersColorDark: boolean = useMediaType('(prefers-color-scheme: dark)')

  const isDarkTheme = theme === 'dark'

  const handleCheck = useCallback(
    (checked: boolean): void => {
      const selectedTheme = checked ? 'dark' : 'light'
      setTheme(selectedTheme)

      if (saveToLocalStorage) {
        setValue(selectedTheme)
      }
    },
    [setTheme, setValue, saveToLocalStorage]
  )

  useEffect(() => {
    if (prefersColorDark) {
      setTheme('dark')
      return
    }
    setTheme(value === 'dark' ? 'dark' : 'light')
  }, [prefersColorDark, setTheme, value])

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
