/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { ComponentOf } from '@javelin/ecs'
import { component, createQuery, useMonitor } from '@javelin/ecs'
import type { Node } from 'ngraph.graph'
import { LabelComponent, NodeComponent } from '../schema'
import type { SystemFactory, World, WorldTickData } from '../type'

const queries = {
  nodes: createQuery(NodeComponent)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LabelExtractor<T = any> = (node: Node<T>) => string | null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NodeLabelSystemOptions<T = any> = {
  labelExtractor: LabelExtractor<T>
}

export const defaultLabelExtractor = (node: Node<Record<string, string> | null>): string | null => {
  return node.data?.['label'] ?? null
}

// eslint-disable-next-line max-lines-per-function
export const NodeLabelSystem: SystemFactory<NodeLabelSystemOptions> =
  (options?: NodeLabelSystemOptions) => (world: World) => {
    const { graph }: WorldTickData = world.latestTickData
    useMonitor(queries.nodes, (e: number, [n]: [ComponentOf<typeof NodeComponent>]) => {
      const node = graph.getNode(n.id)
      const label = node ? (options?.labelExtractor ?? defaultLabelExtractor)(node) : null

      if (label) {
        world.attach(e, component(LabelComponent, { label }))
      }
    })
  }
