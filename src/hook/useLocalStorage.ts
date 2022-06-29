import React from 'react'

export type LocalStorageState = [string | null, (value: string) => void]

const getLocalStorageValue = (key: string): string | null => {
  const saved = localStorage.getItem(key)
  return saved
}

export const useLocalStorage = (key: string): LocalStorageState => {
  const [value, setValue]: LocalStorageState = React.useState(() => getLocalStorageValue(key))

  React.useEffect(() => {
    if (!value) return
    localStorage.setItem(key, value)
  }, [key, value])

  return [value, setValue]
}
