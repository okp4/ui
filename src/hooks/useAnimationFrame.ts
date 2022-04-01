import { useEffect, useRef } from 'react'

export type TAnimationFrameCallback = (deltaTime: number) => void

/**
 * A hook to deal with requestAnimationFrame() in React.
 *
 * @param callback the callback function to call when it's time to update the animation.
 * @param animated tells if a requestAnimationFrame
 */
export const useAnimationFrame: (callback: TAnimationFrameCallback, animated?: boolean) => void = (
  callback: TAnimationFrameCallback,
  animated: boolean = true
) => {
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()

  const animate = (time: DOMHighResTimeStamp): void => {
    if (previousTimeRef.current) {
      const deltaTime = time - previousTimeRef.current

      callback(deltaTime)
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (animated) {
      requestRef.current = requestAnimationFrame(animate)
    } else {
      requestRef.current && cancelAnimationFrame(requestRef.current)
      requestRef.current = undefined
      previousTimeRef.current = undefined
    }

    return () => {
      requestRef.current && cancelAnimationFrame(requestRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animated])
}
