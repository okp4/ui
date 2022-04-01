import React, { useEffect, useRef } from 'react'
import { useAnimationFrame } from '@hooks/useAnimationFrame'
import type { DeepReadonly } from '../../../superTypes'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export type TCanvasCreatedCallback = (canvas: HTMLCanvasElement) => void
export type TCanvasDestroyedCallback = () => void
export type TRenderCanvasCallback = (
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  canvas: HTMLCanvasElement,
  deltaTime: number
) => void

export type TCanvasProps = Readonly<{
  /**
   * Width of the canvas.
   */
  readonly width?: number

  /**
   * Height of the canvas.
   */
  readonly height?: number

  /**
   * Defines if "touch-action: 'none'" is on the canvas.
   */
  readonly touchActionNone?: boolean

  /**
   * Disable scrolling on the canvas element so that it doesn't interfere with
   * zoom in/out actions.
   */
  readonly disableScrolling?: boolean

  /**
   * Specifies if the rendering should be performed.
   */
  readonly animated?: boolean

  /**
   * Called when canvas is created. Can be used to configure the canvas aftewards.
   */
  readonly onCanvasCreated?: TCanvasCreatedCallback

  /**
   * Called when canvas is about to be destroyed.
   */
  readonly onCanvasDestroyed?: TCanvasDestroyedCallback

  /**
   * Called when rendering (if `animated` is set to true)
   */
  readonly onRender?: TRenderCanvasCallback
}>

/**
 * Canvas react component.
 */
export const Canvas: React.FC<TCanvasProps> = ({
  touchActionNone = true,
  disableScrolling = true,
  width,
  height,
  animated = true,
  onCanvasCreated,
  onCanvasDestroyed,
  onRender,
  ...props
}: TCanvasProps): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // const windowSize = useWindowSize()
  const wheelEventListenerFnRef = useRef<EventListenerOrEventListenerObject | null>()

  useEffect(() => {
    if (wheelEventListenerFnRef.current) {
      canvasRef.current?.removeEventListener('wheel', wheelEventListenerFnRef.current)
      wheelEventListenerFnRef.current = null
    }

    if (disableScrolling) {
      const onWheel: EventListenerOrEventListenerObject = (evt: DeepReadonly<Event>) =>
        evt.preventDefault()
      wheelEventListenerFnRef.current = onWheel
      canvasRef.current?.addEventListener('wheel', onWheel)
    }
  }, [canvasRef, disableScrolling])

  useEffect(() => {
    if (canvasRef.current) {
      if (onCanvasCreated) {
        onCanvasCreated(canvasRef.current)
      }

      return () => {
        if (onCanvasDestroyed) {
          onCanvasDestroyed()
        }
      }
    }
  }, [canvasRef, onCanvasCreated, onCanvasDestroyed])

  useAnimationFrame((deltaTime: number) => {
    if (canvasRef.current && onRender) {
      onRender(canvasRef.current, deltaTime)
    }
  }, animated)

  const opts: Record<string, string | number> = {}

  if (touchActionNone) {
    opts['touch-action'] = 'none'
  }

  if (width !== undefined && height !== undefined) {
    opts['width'] = width
    opts['height'] = height
  }

  return <canvas ref={canvasRef} {...props} {...opts} />
}
