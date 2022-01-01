import { useEffect, useRef } from 'react'

export type TAnimationFrameCallback = (deltaTime: number) => void

/**
 * A hook to deal with requestAnimationFrame() in React.
 *
 * @param callback the callback function to call when it's time to update the animation.
 */
export const useAnimationFrame: (callbacl: TAnimationFrameCallback) => void = (
  callback: TAnimationFrameCallback
) => {
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()

  const animate = (time: DOMHighResTimeStamp) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current
      callback(deltaTime)
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      requestRef.current && cancelAnimationFrame(requestRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
