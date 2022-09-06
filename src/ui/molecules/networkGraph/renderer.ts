/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { Engine } from '@babylonjs/core'
import { Scene } from '@babylonjs/core'
import { createWorld } from '@javelin/ecs'
import type { Graph } from 'ngraph.graph'
import type { EngineCreatedCallback, RenderCallback } from '../../atoms/babylonEngine/BabylonEngine'
import { GraphLayoutSystem } from './ecs/system/graphLayoutSystem'
import { InstallCameraSystem } from './ecs/system/installCameraSystem'
import { InstallLightSystem } from './ecs/system/installLightSystem'
import { NodeLabelSystem } from './ecs/system/nodeLabelSystem'
import { NodeTooltipSystem } from './ecs/system/nodeTooltipSystem'
import { PrepareSceneSystem } from './ecs/system/prepareSceneSystem'
import { SpawnGraphSystem } from './ecs/system/spawnGraphSystem'
import { UpdateLinksMeshSystem, UpdateNodesMeshSystem } from './ecs/system/updateMeshSystem'
import type { System, World, WorldTickData } from './ecs/type'

export type State = {
  world: World
  scene: Scene
}

const defaultSystems = (): System[] => [
  PrepareSceneSystem(),
  InstallCameraSystem(),
  InstallLightSystem(),
  SpawnGraphSystem(),
  GraphLayoutSystem(),
  NodeLabelSystem(),
  NodeTooltipSystem(),
  UpdateNodesMeshSystem(),
  UpdateLinksMeshSystem()
]

export const onEngineCreated: <NODE_DATA, LINK_DATA>(
  graph: Graph<NODE_DATA, LINK_DATA>,
  systems?: System[]
) => EngineCreatedCallback<State> =
  <NODE_DATA, LINK_DATA>(graph: Graph<NODE_DATA, LINK_DATA>, systems?: System[]) =>
  (engine: Engine) => {
    const scene = new Scene(engine)
    const world = createWorld<WorldTickData>()

    const data: WorldTickData = {
      time: performance.now(),
      graph: graph,
      scene: scene
    }
    scene.registerBeforeRender(() => {
      data.time = performance.now()
      world.step(data)
    })

    ;(systems ?? defaultSystems()).forEach(world.addSystem)

    return { world, scene }
  }

export const onRender: () => RenderCallback<State> = () => (state: State) => {
  const { scene }: State = state

  scene.render()

  return state
}
