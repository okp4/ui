import { useEffect, useState } from 'react'
import type { DeepReadonly } from 'superTypes'

export const useMediaType = (query: string): boolean => {
  const [matches, setMatches]: [boolean, (value: boolean) => void] = useState<boolean>(false)

  useEffect(() => {
    const matchQueryList = window.matchMedia(query)

    const handleMatch = (event: DeepReadonly<MediaQueryListEvent>): void => {
      setMatches(event.matches)
    }
    matchQueryList.addEventListener('change', handleMatch)
    return () => {
      matchQueryList.removeEventListener('change', handleMatch)
    }
  }, [query])

  return matches
}
