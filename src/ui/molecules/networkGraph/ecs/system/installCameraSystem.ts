/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import { ArcRotateCamera, Vector3 } from '@babylonjs/core'
import { useInit } from '@javelin/ecs'
import type { SystemFactory, World, WorldTickData } from '../type'

export type InstallCameraSystemOptions = {
  name: string
  alpha: number
  beta: number
  radius: number
  target: Vector3
}

export const defaultArcRotateCamera = {
  name: 'camera-world',
  alpha: Math.PI / 2,
  beta: Math.PI / 3,
  radius: 300,
  target: Vector3.Zero()
}

/**
 * The InstallCameraSystem just installs the camera in the scene on initialization.
 */
export const InstallCameraSystem: SystemFactory<InstallCameraSystemOptions> =
  (options?: InstallCameraSystemOptions) => (world: World) => {
    if (useInit()) {
      const { scene }: WorldTickData = world.latestTickData
      const camera = new ArcRotateCamera(
        options?.name ?? defaultArcRotateCamera.name,
        options?.alpha ?? defaultArcRotateCamera.alpha,
        options?.beta ?? defaultArcRotateCamera.beta,
        options?.radius ?? defaultArcRotateCamera.radius,
        options?.target ?? defaultArcRotateCamera.target,
        scene
      )
      const canvas = scene.getEngine().getRenderingCanvas()

      camera.setTarget(Vector3.Zero())
      camera.attachControl(canvas, true)
    }
  }
