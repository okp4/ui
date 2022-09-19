/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { Mesh, Scene } from '@babylonjs/core'
import { Color4, Color3, MeshBuilder, StandardMaterial } from '@babylonjs/core'
import type { Node, Graph } from 'ngraph.graph'
import type { DeepReadonly } from 'superTypes'
import type { NodeMeshFactory } from 'ui/molecules/networkGraph/ecs/system/spawnGraphSystem'

export type FamilyTreeObject = DeepReadonly<{
  name: string
  gender: string
  dateOfBirth: string
  dateOfDeath: string
  portrait: string
  parents?: object
}>

export const buildFamilyTreeGraph = (
  current: object,
  parent: string | null,
  graph: DeepReadonly<Graph>
): void => {
  Object.values(current).forEach((key: FamilyTreeObject) => {
    const { name, gender, dateOfBirth, dateOfDeath, portrait, parents }: FamilyTreeObject = key
    const node = graph.addNode(name)

    node.data = { name, gender, dateOfBirth, dateOfDeath, portrait }
    parent && graph.addLink(parent, name)
    typeof parents === 'object' && buildFamilyTreeGraph(parents, name, graph)
  })
}

export const familyTreeNodeMeshFactory: NodeMeshFactory = (
  node: DeepReadonly<Node>,
  scene: Scene
): Mesh => {
  if (node.data.gender === 'female') {
    const material = new StandardMaterial('material#node', scene)

    material.diffuseColor = new Color3(0.9, 0.14, 0.19)
    material.alpha = 1

    const mesh = MeshBuilder.CreateSphere(
      `node:sphere#${node.id}`,
      {
        diameter: 5,
        segments: 20
      },
      scene
    )

    mesh.metadata = {
      '@tyle': 'node',
      nodeId: node.id
    }
    mesh.material = material
    return mesh
  }

  const material = new StandardMaterial('material#node', scene)
  const faceColors = new Array(6).fill(new Color4(0.12, 0.28, 0.6, 1))

  material.alpha = 1

  const mesh = MeshBuilder.CreateBox(
    `node:box#${node.id}`,
    {
      size: 5,
      faceColors: faceColors
    },
    scene
  )

  mesh.metadata = {
    '@tyle': 'node',
    nodeId: node.id
  }
  mesh.material = material
  return mesh
}

type EvmosValidatorData = DeepReadonly<{
  validators: EvmosValidator[]
  total_voting_power: string
}>

export type EvmosValidator = DeepReadonly<{
  address: string
  voting_power: string
  percentVotingPower: number
}>

export const buildValidatorGraph = (data: EvmosValidatorData, graph: DeepReadonly<Graph>): void => {
  const { validators, total_voting_power }: EvmosValidatorData = data

  validators.forEach((validator: EvmosValidator, index: number) => {
    const { address, voting_power }: EvmosValidator = validator
    const percentVotingPower = Number(voting_power) / Number(total_voting_power)
    const node = graph.getNode(index)

    if (node) {
      node.data = { address, voting_power, percentVotingPower }
    }
  })
}

export const validatorNodeMeshFactory: NodeMeshFactory = (
  node: DeepReadonly<Node>,
  scene: Scene
): Mesh => {
  const material = new StandardMaterial('material#node', scene)
  const percentVotingPower = node.data.percentVotingPower

  switch (true) {
    case percentVotingPower < 0.0019:
      material.diffuseColor = new Color3(10, 10, 5)
      break
    case percentVotingPower > 0.01:
      material.diffuseColor = new Color3(0.3, 0.5, 0.9)
      break
    default:
      material.diffuseColor = new Color3(
        percentVotingPower * 200,
        percentVotingPower * 300,
        percentVotingPower * 350
      )
  }
  material.alpha = 1

  const mesh = MeshBuilder.CreateSphere(
    `node:sphere#${node.id}`,
    {
      diameter: percentVotingPower * 2500,
      segments: 20
    },
    scene
  )
  mesh.metadata = {
    '@tyle': 'node',
    nodeId: node.id as number
  }
  mesh.material = material
  return mesh
}
