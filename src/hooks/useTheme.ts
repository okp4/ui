import React from 'react'
import ThemeContext from '@ui/atoms/theme/themeContext'
import type { ThemeContextType } from '@ui/atoms/theme/themeContext'

export const useTheme = (): ThemeContextType => {
  const themeContext = React.useContext(ThemeContext)
  if (themeContext === null) {
    throw new Error(
      'Theme context not found. Try wrapping a parent component with <ThemeContext.Provider>.'
    )
  }
  return themeContext
}
