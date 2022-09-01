import React from 'react'

import type { DeepReadonly } from 'superTypes'
import { BabylonEngine } from '../babylonEngine/BabylonEngine'
import type { BabylonEngineProps } from '../babylonEngine/BabylonEngine'

export type NetworkGraphProps<STATE> = Omit<BabylonEngineProps<STATE>, 'onRender'>

export const NetworkGraph = <STATE,>({
  ...props
}: DeepReadonly<NetworkGraphProps<STATE>>): JSX.Element => {
  return <BabylonEngine {...props} />
}
