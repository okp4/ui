import React, { useCallback, useEffect } from 'react'
import * as Switch from '@radix-ui/react-switch'
import type { Theme, ThemeContextType } from 'context/themeContext'
import { useTheme } from 'hook/useTheme'
import './themeSwitcher.scss'
import { useLocalStorage } from 'hook/useLocalStorage'
import type { LocalStorageState } from 'hook/useLocalStorage'
import { useMediaType } from 'hook/useMediaType'
import { Icon } from 'ui/atoms/icon/Icon'

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
    if (!value) {
      setTheme(prefersColorDark ? 'dark' : 'light')
      return
    }
    setTheme(value as Theme)
  }, [prefersColorDark, setTheme, value])

  return (
    <Switch.Root
      checked={theme === 'dark'}
      className="okp4-theme-switcher-main"
      onCheckedChange={handleCheck}
    >
      <div className={`okp4-theme-switcher-icon ${theme}`}>
        <Icon name="theme-switcher" size={18} />
      </div>
      <Switch.Thumb className="okp4-theme-switcher-thumb" />
    </Switch.Root>
  )
}
