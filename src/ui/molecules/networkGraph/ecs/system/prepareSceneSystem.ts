/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import { Color3, Color4 } from '@babylonjs/core'
import { useInit } from '@javelin/ecs'
import type { SystemFactory, World, WorldTickData } from '../type'

export type PrepareSceneSystemOptions = {
  clearColor: Color4
  ambientColor: Color3
}

export const defaultSceneParameters = {
  clearColor: Color4.FromColor3(Color3.Black()),
  ambientColor: Color3.FromHexString('#bbbbbb')
}

/**
 * The PrepareSceneSystem just initialize the scene with some parameters.
 */
export const PrepareSceneSystem: SystemFactory<PrepareSceneSystemOptions> =
  (options?: PrepareSceneSystemOptions) => (world: World) => {
    if (useInit()) {
      const { scene }: WorldTickData = world.latestTickData

      scene.clearColor = options?.clearColor ?? defaultSceneParameters.clearColor
      scene.ambientColor = options?.ambientColor ?? defaultSceneParameters.ambientColor
    }
  }
