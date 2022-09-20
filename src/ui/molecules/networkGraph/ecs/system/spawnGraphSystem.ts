/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { Mesh, Scene } from '@babylonjs/core'
import { Color3, MeshBuilder, StandardMaterial, Vector3 } from '@babylonjs/core'
import { component, toComponent, useInit } from '@javelin/ecs'
import type { Link, Node } from 'ngraph.graph'
import { LinkComponent, MeshComponent, NodeComponent, PositionComponent } from '../schema'
import type { SystemFactory, World, WorldTickData } from '../type'

type MeshFactory<T> = (o: T, scene: Scene) => Mesh
export type NodeMeshFactory = MeshFactory<Node>
export type LinkMeshFactory = MeshFactory<Link>

export type SpawnGraphSystemOptions = {
  nodeMeshFactory: NodeMeshFactory
  linkMeshFactory: LinkMeshFactory
}

const defaultNodeMeshFactory: NodeMeshFactory = (node: Node, scene: Scene): Mesh => {
  const material = new StandardMaterial('material#node', scene)
  material.diffuseColor = new Color3(1, 1, 0.7)
  material.alpha = 0.9

  const mesh = MeshBuilder.CreateSphere(
    `node:sphere#${node.id}`,
    {
      diameter: 5,
      segments: 2
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

const defaultLinkMeshFactory: LinkMeshFactory = (link: Link, scene: Scene): Mesh => {
  const mesh = MeshBuilder.CreateLines(
    `link:line#${link.id}`,
    {
      points: [new Vector3(0, 0, 0), new Vector3(0, 0, 0)],
      updatable: true
    },
    scene
  )
  mesh.color = new Color3(0.3, 0.3, 0.4)

  return mesh
}

export const SpawnGraphSystem: SystemFactory<SpawnGraphSystemOptions> =
  (options?: SpawnGraphSystemOptions) => (world: World) => {
    if (useInit()) {
      const nodeMeshFactory = options?.nodeMeshFactory ?? defaultNodeMeshFactory
      const linkMeshFactory = options?.linkMeshFactory ?? defaultLinkMeshFactory
      const { graph, scene }: WorldTickData = world.latestTickData

      const nodes: Map<number, number> = new Map()
      graph.forEachNode((node: Node) => {
        const id = node.id as number
        const mesh = nodeMeshFactory(node, scene)

        nodes.set(
          id,
          world.create(
            component(NodeComponent, { id }),
            component(PositionComponent, { x: 0, y: 0, z: 0 }),
            toComponent(mesh, MeshComponent)
          )
        )
      })

      graph.forEachLink((link: Link) => {
        const mesh = linkMeshFactory(link, scene)

        world.create(
          component(LinkComponent, {
            id: link.id,
            fromEntity: nodes.get(link.fromId as number),
            toEntity: nodes.get(link.toId as number)
          }),
          toComponent(mesh, MeshComponent)
        )
      })
    }
  }
