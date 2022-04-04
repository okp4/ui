import React from 'react'

export type UseLocalStorageType = [string, React.Dispatch<React.SetStateAction<string>>]

const getLocalStorageValue = (key: string, defaultValue: string): string => {
  const saved = localStorage.getItem(key)
  return saved ? saved : defaultValue
}

export const useLocalStorage = (key: string, defaultValue: string): UseLocalStorageType => {
  const [value, setValue]: UseLocalStorageType = React.useState(() =>
    getLocalStorageValue(key, defaultValue)
  )

  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
