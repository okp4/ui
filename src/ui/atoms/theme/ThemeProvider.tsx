import React from 'react'
import type { Theme } from 'context/themeContext'
import ThemeContext from 'context/themeContext'
import type { DeepReadonly } from '../../../superTypes'

type ThemeProviderProps = DeepReadonly<{
  children: React.ReactNode
}>

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }: ThemeProviderProps) => {
  // eslint-disable-next-line @typescript-eslint/typedef
  const [theme, setTheme] = React.useState<Theme>('light')
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`theme--${theme}`}>{children}</div>
    </ThemeContext.Provider>
  )
}
