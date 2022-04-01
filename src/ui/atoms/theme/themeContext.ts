import React from 'react'

export type Theme = 'light' | 'dark'
export type ThemeContextType = Readonly<{
  theme: Theme
  setTheme: (newTheme: Theme) => void
}>

const ThemeContext = React.createContext<ThemeContextType | null>(null)
export default ThemeContext
