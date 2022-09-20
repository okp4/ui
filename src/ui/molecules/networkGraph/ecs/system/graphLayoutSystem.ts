/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { ComponentOf } from '@javelin/ecs'
import { createQuery, useInit, useRef } from '@javelin/ecs'
import type { Layout, PhysicsSettings, Vector } from 'ngraph.forcelayout'
import createLayout from 'ngraph.forcelayout'
import type { Graph } from 'ngraph.graph'
import { NodeComponent, PositionComponent } from '../schema'
import type { SystemFactory, World, WorldTickData } from '../type'

const queries = {
  nodes: createQuery(NodeComponent, PositionComponent)
}

export type GraphLayoutSystemOptions = Partial<{
  physicsSettings: Partial<PhysicsSettings>
}>

export const defaultPhysicsSettings = {
  dimensions: 3,
  timeStep: 0.9,
  springLength: 10,
  springCoefficient: 0.8,
  gravity: -12,
  dragCoefficient: 0.9
}

/**
 * The GraphLayoutSystem is resposible for managing (and maintaining) the layouting of the graph
 * using a direct-force algorithm.
 */
export const GraphLayoutSystem: SystemFactory<GraphLayoutSystemOptions> =
  (options?: GraphLayoutSystemOptions) => (world: World) => {
    const layoutRef = useRef<Layout<Graph> | null>(null)

    if (useInit()) {
      const { graph }: WorldTickData = world.latestTickData

      layoutRef.value = createLayout<Graph>(
        graph,
        options?.physicsSettings ?? defaultPhysicsSettings
      )
    }

    layoutRef.value?.step()
    layoutRef.value?.step()

    queries.nodes(
      (
        _: number,
        [n, p]: [ComponentOf<typeof NodeComponent>, ComponentOf<typeof PositionComponent>]
      ) => {
        if (layoutRef.value) {
          const position: Vector | undefined = layoutRef.value.getNodePosition(n.id)

          p.x = position.x
          p.y = position.y
          p.z = position.z ?? 0
        }
      }
    )
  }
