import React from 'react'

export type LocalStorageState = [string, (value: string) => void]

const getLocalStorageValue = (key: string, defaultValue: string): string => {
  const saved = localStorage.getItem(key)
  return saved ? saved : defaultValue
}

export const useLocalStorage = (key: string, defaultValue: string): LocalStorageState => {
  const [value, setValue]: LocalStorageState = React.useState(() =>
    getLocalStorageValue(key, defaultValue)
  )

  React.useEffect(() => {
    localStorage.setItem(key, value)
  }, [key, value])

  return [value, setValue]
}
