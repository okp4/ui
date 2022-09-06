import type { Scene } from '@babylonjs/core'
import type { System as ECSSystem, World as ECSWorld } from '@javelin/ecs'
import type { Graph } from 'ngraph.graph'

export type WorldTickData = {
  time: number
  scene: Scene
  graph: Graph
}

export type World = ECSWorld<WorldTickData>
export type System = ECSSystem<WorldTickData>
export type SystemFactory<O = void> = (options?: O) => System
