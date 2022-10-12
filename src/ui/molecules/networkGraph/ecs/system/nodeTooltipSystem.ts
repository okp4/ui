/* eslint-disable react-hooks/rules-of-hooks */
import type { ActionEvent, Mesh, Scene } from '@babylonjs/core'
import { ActionManager, ExecuteCodeAction } from '@babylonjs/core'
import type { ComponentOf } from '@javelin/ecs'
import { createQuery, useInit, useMonitor, useRef } from '@javelin/ecs'
import { MeshComponent, NodeComponent } from '../schema'
import type { SystemFactory, World, WorldTickData } from '../type'
import type { Node } from 'ngraph.graph'
import type { DeepReadonly } from 'superTypes'

const queries = {
  nodes: createQuery(NodeComponent, MeshComponent)
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export type TooltipExtractor<T> = (node: DeepReadonly<Node<T>>) => HTMLDivElement | null

export type NodeTooltipOptions<T> = {
  tooltipExtractor: TooltipExtractor<T>
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const createTooltipDiv = (scene: Scene): HTMLDivElement | null => {
  const canvas = scene.getEngine().getRenderingCanvas()
  const document = canvas?.ownerDocument
  const parent = canvas?.parentElement

  if (document && parent) {
    const containerDiv = document.createElement('div')
    containerDiv.classList.add('scene-tooltip')
    containerDiv.style.position = 'relative'

    parent.insertBefore(containerDiv, canvas)

    const tooltipDiv = document.createElement('div')
    tooltipDiv.style.position = 'absolute'
    containerDiv.appendChild(tooltipDiv)

    return tooltipDiv
  }

  return null
}

export const defaultTooltipExtractor: TooltipExtractor<Record<string, string> | null> = (
  node: DeepReadonly<Node<Record<string, string> | null>>
) => {
  const label = node.data?.['label'] ?? ''

  if (label) {
    const div = document.createElement('div')
    div.innerText = node.data?.['label'] ?? ''

    return div
  }

  return null
}

/**
 * The NodeTooltipSystem is in charge of displaying a tooltip (in html) during the hover of an entity with the components
 * mesh and node.
 */
export const NodeTooltipSystem: SystemFactory<NodeTooltipOptions<World>> =
  // eslint-disable-next-line max-lines-per-function, @typescript-eslint/prefer-readonly-parameter-types
  (options?: DeepReadonly<NodeTooltipOptions<World>>) => (world: World) => {
    const { scene, graph }: WorldTickData = world.latestTickData
    const tooltipDivRef = useRef<HTMLDivElement | null>(null)

    if (useInit()) {
      tooltipDivRef.value = createTooltipDiv(scene)
    }

    useMonitor(
      queries.nodes,
      (
        _: number,
        [n, m]: DeepReadonly<[ComponentOf<typeof NodeComponent>, ComponentOf<typeof MeshComponent>]>
      ) => {
        const mesh = m as Mesh
        const actionManager = mesh.actionManager ? mesh.actionManager : new ActionManager(scene)
        const tooltipExtractor = options?.tooltipExtractor ?? defaultTooltipExtractor
        const actions = [
          // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
          new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, (evt: ActionEvent) => {
            if (tooltipDivRef.value) {
              const node = graph.getNode(n.id)

              const width = scene.getEngine().getRenderingCanvas()?.width ?? 1
              const height = scene.getEngine().getRenderingCanvas()?.height ?? 0
              const [x, y]: [number, number] = [evt.pointerX, evt.pointerY]

              tooltipDivRef.value.style.left = `${x}px`
              tooltipDivRef.value.style.top = `${y}px`
              tooltipDivRef.value.style.color = 'white'
              tooltipDivRef.value.style.transform = `translate(-${(x / width) * 100}%, ${
                height - y < 100 ? 'calc(-100% - 8px)' : '21px'
              })`

              if (node) {
                const tooltip = tooltipExtractor(node)
                tooltipDivRef.value.innerText = ''

                if (tooltip) {
                  tooltipDivRef.value.appendChild(tooltip)
                }
              }
            }
          }),
          new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, () => {
            if (tooltipDivRef.value) {
              tooltipDivRef.value.innerText = ''
            }
          })
        ]
        actions.forEach(actionManager.registerAction.bind(actionManager))

        mesh.actionManager = actionManager
      }
    )
  }
