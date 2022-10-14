/* eslint-disable max-lines-per-function */
import React, { useEffect, useRef } from 'react'
import { useAnimationFrame } from 'hook/useAnimationFrame'
import type { Callback, DeepReadonly } from 'superTypes'

export type CanvasCreatedCallback = Callback<HTMLCanvasElement, void>
export type CanvasDestroyedCallback = Callback<void, void>
export type RenderCanvasCallback = Callback<{ canvas: HTMLCanvasElement; deltaTime: number }, void>

export type CanvasProps = Readonly<{
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
   * Called when canvas is created. Can be used to configure the canvas afterwards.
   */
  readonly onCanvasCreated?: CanvasCreatedCallback

  /**
   * Called when canvas is about to be destroyed.
   */
  readonly onCanvasDestroyed?: CanvasDestroyedCallback

  /**
   * Called when rendering (if `animated` is set to true)
   */
  readonly onRender?: RenderCanvasCallback
}>

/**
 * Canvas react component.
 */
export const Canvas: React.FC<CanvasProps> = ({
  touchActionNone = true,
  disableScrolling = true,
  width,
  height,
  animated = true,
  onCanvasCreated,
  onCanvasDestroyed,
  onRender,
  ...props
}: CanvasProps): JSX.Element => {
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
      onRender({ canvas: canvasRef.current, deltaTime })
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
