import React from 'react'

import { BabylonEngine } from 'ui/atoms/babylonEngine/BabylonEngine'
import type { BabylonEngineProps } from 'ui/atoms/babylonEngine/BabylonEngine'
import type { Graph } from 'ngraph.graph'
import type { State } from './renderer'
import { onRender, onEngineCreated } from './renderer'
import type { System } from './ecs/type'

export type NetworkGraphProps<STATE, NODE_DATA, LINK_DATA> = Omit<
  Omit<BabylonEngineProps<STATE>, 'onRender'>,
  'onEngineCreated'
> & {
  graph: Graph<NODE_DATA, LINK_DATA>
  systems?: System[]
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const NetworkGraph = <NODE_DATA, LINK_DATA>({
  graph,
  systems,
  ...props
}: NetworkGraphProps<State, NODE_DATA, LINK_DATA>): JSX.Element => {
  return (
    <BabylonEngine
      {...props}
      onEngineCreated={onEngineCreated(graph, systems)}
      onRender={onRender()}
    />
  )
}
