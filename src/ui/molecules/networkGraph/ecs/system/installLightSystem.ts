/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import { Color3, HemisphericLight, Vector3 } from '@babylonjs/core'
import { useInit } from '@javelin/ecs'
import type { SystemFactory, World, WorldTickData } from '../type'

export const InstallLightSystem: SystemFactory = () => (world: World) => {
  if (useInit()) {
    const { scene }: WorldTickData = world.latestTickData

    const light1 = new HemisphericLight('light#1', new Vector3(0, 1, 0), scene)
    light1.intensity = 0.5
    light1.diffuse = Color3.FromHexString('#ffffff')
    light1.specular = new Color3(0, 0, 0)

    const light2 = new HemisphericLight('light#2', new Vector3(1, 0, 0), scene)
    light2.intensity = 0.5
    light2.diffuse = Color3.FromHexString('#ffffff')
    light2.specular = new Color3(0, 0, 0)
  }
}
