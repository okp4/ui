import { useEffect, useCallback } from 'react'
import type { RefObject } from 'react'
import type { Callback, DeepReadonly } from 'superTypes'

export type MouseEvent = 'mousedown' | 'mouseup'

export const useOnClickOutside = <T extends HTMLElement = HTMLDivElement>(
  ref: RefObject<T>,
  handler: Callback<Event, void>,
  mouseEvent: MouseEvent = 'mousedown'
): void => {
  const callback = useCallback(
    (event: DeepReadonly<Event>) => {
      const el = ref.current

      if (!el || el.contains(event.target as Node)) {
        return
      }
      
      handler(event)
    },
    [handler, ref]
  )

  useEffect(() => {
    window.addEventListener(mouseEvent, callback)

    return () => window.removeEventListener(mouseEvent, callback)
  }, [callback, mouseEvent])
}
