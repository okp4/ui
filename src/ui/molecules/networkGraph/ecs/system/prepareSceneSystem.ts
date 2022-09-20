/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import { Color3, Color4 } from '@babylonjs/core'
import { useInit } from '@javelin/ecs'
import type { SystemFactory, World, WorldTickData } from '../type'

/**
 * The PrepareSceneSystem just initialize the scene with some parameters.
 */
export const PrepareSceneSystem: SystemFactory = () => (world: World) => {
  if (useInit()) {
    const { scene }: WorldTickData = world.latestTickData

    scene.clearColor = Color4.FromColor3(Color3.Black())
    scene.ambientColor = Color3.FromHexString('#bbbbbb')
  }
}
