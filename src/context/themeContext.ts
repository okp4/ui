import { createContext } from 'react'

export type Theme = 'light' | 'dark'
export type ThemeContextType = Readonly<{
  theme: Theme
  setTheme: (newTheme: Theme) => void
}>

const ThemeContext = createContext<ThemeContextType | null>(null)
export default ThemeContext
