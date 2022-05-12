import { useMediaType } from './useMediaType'

export type Breakpoints = {
  isXsmall: boolean
  isSmall: boolean
  isMedium: boolean
  isLarge: boolean
  isXLarge: boolean
}

export const useBreakpoint = (): Breakpoints => ({
  isXsmall: useMediaType('(max-width: 480px)'), // Mobile device.
  isSmall: useMediaType('(min-width: 481px) and (max-width: 768px)'), // Tablette device.
  isMedium: useMediaType('(min-width: 769px) and (max-width: 1024px)'), // Small laptop screen.
  isLarge: useMediaType('(min-width: 1025px) and (max-width: 1200px)'), // desktop large screen.
  isXLarge: useMediaType('(min-width: 1201px)') // Extra large screens.
})
