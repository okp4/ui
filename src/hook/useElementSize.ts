import { useEffect, useCallback, useState } from 'react'

export type ElementSize = Readonly<{
  width: number
  height: number
}>

export const useElementSize: <T extends HTMLElement = HTMLDivElement>() => [
  ElementSize | null,
  (node: T | null) => void
] = <T extends HTMLElement = HTMLDivElement>() => {
  type Opt<U> = U | null
  type State<U> = [U, (value: U) => void]

  const [ref, setRef]: State<Opt<T>> = useState<Opt<T>>(null)
  const [size, setSize]: State<Opt<ElementSize>> = useState<Opt<ElementSize>>(null)

  const handleSize = useCallback(() => {
    if (ref) {
      setSize({
        width: ref.offsetWidth,
        height: ref.offsetHeight
      })
    }
  }, [ref])

  useEffect(() => {
    window.addEventListener('resize', handleSize)

    handleSize()

    return () => window.removeEventListener('resize', handleSize)
  }, [handleSize])

  return [size, setRef]
}
