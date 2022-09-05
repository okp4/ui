/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { ActionEvent, Mesh, Scene } from '@babylonjs/core'
import { ActionManager, ExecuteCodeAction } from '@babylonjs/core'
import type { ComponentOf } from '@javelin/ecs'
import { createQuery, useInit, useMonitor, useRef } from '@javelin/ecs'
import { LabelComponent, MeshComponent, NodeComponent } from '../schema'
import type { SystemFactory, World, WorldTickData } from '../type'

const queries = {
  nodes: createQuery(NodeComponent, MeshComponent, LabelComponent)
}

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

// eslint-disable-next-line max-lines-per-function
export const NodeTooltipSystem: SystemFactory = () => (world: World) => {
  const { scene }: WorldTickData = world.latestTickData
  const tooltipDivRef = useRef<HTMLDivElement | null>(null)

  if (useInit()) {
    tooltipDivRef.value = createTooltipDiv(scene)
  }

  useMonitor(
    queries.nodes,
    (
      _: number,
      [, m, l]: [
        ComponentOf<typeof NodeComponent>,
        ComponentOf<typeof MeshComponent>,
        ComponentOf<typeof LabelComponent>
      ]
    ) => {
      const mesh = m as Mesh
      const actionManager = mesh.actionManager ? mesh.actionManager : new ActionManager(scene)

      const actions = [
        new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, (evt: ActionEvent) => {
          if (tooltipDivRef.value) {
            const width = scene.getEngine().getRenderingCanvas()?.width ?? 1
            const height = scene.getEngine().getRenderingCanvas()?.height ?? 0
            const [x, y]: [number, number] = [evt.pointerX, evt.pointerY]

            tooltipDivRef.value.style.left = `${x}px`
            tooltipDivRef.value.style.top = `${y}px`
            tooltipDivRef.value.style.color = 'white'
            tooltipDivRef.value.style.transform = `translate(-${(x / width) * 100}%, ${
              height - y < 100 ? 'calc(-100% - 8px)' : '21px'
            })`
            tooltipDivRef.value.innerText = l.label
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
