/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import { ArcRotateCamera, Vector3 } from '@babylonjs/core'
import { useInit } from '@javelin/ecs'
import type { SystemFactory, World, WorldTickData } from '../type'

export const InstallCameraSystem: SystemFactory = () => (world: World) => {
  if (useInit()) {
    const { scene }: WorldTickData = world.latestTickData
    const camera = new ArcRotateCamera(
      'camera-world',
      Math.PI / 2,
      Math.PI / 3,
      300,
      Vector3.Zero(),
      scene
    )
    const canvas = scene.getEngine().getRenderingCanvas()

    camera.setTarget(Vector3.Zero())
    camera.attachControl(canvas, true)
  }
}
