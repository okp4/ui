import React, { useEffect, useRef, useState } from 'react'
import type { EngineOptions } from '@babylonjs/core'
import { Engine } from '@babylonjs/core'
import { Canvas } from 'ui/atoms/canvas/Canvas'
import type { Callback, DeepReadonly, StateHook } from 'superTypes'

export type EngineCreatedCallback<STATE> = Callback<Engine, STATE>
export type RenderCallback<STATE> = Callback<STATE, STATE>

export type BabylonEngineProps<STATE> = {
  /**
   * Enable antialiasing.
   */
  antialias?: boolean

  /**
   * Defines whether to adapt to the device's viewport characteristics.
   */
  adaptToDeviceRatio?: boolean

  /**
   * Further options for the babylone engine.
   */
  options?: EngineOptions

  /**
   * Defines if "touch-action: 'none'" is on the canvas.
   */
  touchActionNone?: boolean

  /**
   * Disable scrolling on the canvas element so that it doesn't interfere with
   * zoom in/out actions.
   */
  disableScrolling?: boolean

  /**
   * Width of the canvas.
   */
  width?: number

  /**
   * Height of the canvas.
   */
  height?: number

  /**
   * Called when engine is created. Can be used to configure the engine afterwards.
   */
  onEngineCreated?: EngineCreatedCallback<STATE>

  /**
   * Called when rendering.
   */
  onRender?: RenderCallback<STATE>
}

// eslint-disable-next-line max-lines-per-function
export const BabylonEngine = <STATE,>({
  antialias = false,
  adaptToDeviceRatio = false,
  touchActionNone = true,
  disableScrolling = true,
  width,
  height,
  options,
  onEngineCreated,
  onRender,
  ...props
}: DeepReadonly<BabylonEngineProps<STATE>>): JSX.Element => {
  const [canvas, setCanvas]: StateHook<HTMLCanvasElement | null> =
    useState<HTMLCanvasElement | null>(null)
  const [engine, setEngine]: StateHook<Engine | null> = useState<Engine | null>(null)
  const stateRef = useRef<STATE | null>(null)

  useEffect(() => {
    if (canvas) {
      const engine = new Engine(canvas, antialias, options, adaptToDeviceRatio)
      setEngine(engine)

      if (onEngineCreated) {
        stateRef.current = onEngineCreated(engine)
      }

      return () => {
        engine.dispose()
        setEngine(null)
      }
    }
  }, [adaptToDeviceRatio, antialias, canvas, onEngineCreated, options])

  useEffect(() => {
    if (engine) {
      engine.runRenderLoop(() => {
        if (onRender && stateRef.current) {
          stateRef.current = onRender(stateRef.current)
        }
      })
    }
  }, [engine, onRender])

  useEffect(() => {
    engine?.resize()
  }, [engine, width, height])

  return (
    <Canvas
      {...props}
      animated={false}
      disableScrolling={disableScrolling}
      height={height}
      onCanvasCreated={setCanvas}
      touchActionNone={touchActionNone}
      width={width}
    />
  )
}
