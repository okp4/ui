import React from 'react'
import type { ThemeContextType } from 'context/themeContext'
import ThemeContext from 'context/themeContext'

export const useTheme = (): ThemeContextType => {
  const themeContext = React.useContext(ThemeContext)
  if (themeContext === null) {
    throw new Error(
      'Theme context not found. Try wrapping a parent component with <ThemeContext.Provider>.'
    )
  }
  return themeContext
}
