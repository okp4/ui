/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { Mesh } from '@babylonjs/core'
import { VertexBuffer } from '@babylonjs/core'
import type { ComponentOf } from '@javelin/ecs'
import { createQuery } from '@javelin/ecs'
import { LinkComponent, MeshComponent, NodeComponent, PositionComponent } from '../schema'
import type { SystemFactory, World } from '../type'

const queries = {
  meshes: createQuery(MeshComponent, PositionComponent),
  links: createQuery(LinkComponent, MeshComponent),
  nodes: createQuery(NodeComponent, PositionComponent)
}

export const UpdateNodesMeshSystem: SystemFactory = () => () => {
  queries.meshes(
    (
      _: number,
      [m, p]: [ComponentOf<typeof MeshComponent>, ComponentOf<typeof PositionComponent>]
    ) => {
      const mesh: Mesh = m as Mesh

      mesh.position.x = p.x
      mesh.position.y = p.y
      mesh.position.z = p.z
    }
  )
}

export const UpdateLinksMeshSystem: SystemFactory =
  () =>
  ({ get }: World) => {
    queries.links(
      (
        _: number,
        [l, m]: [ComponentOf<typeof LinkComponent>, ComponentOf<typeof MeshComponent>]
      ) => {
        const mesh: Mesh = m as Mesh
        const positions = mesh.getVerticesData(VertexBuffer.PositionKind) ?? []
        const p1 = get(l.fromEntity, PositionComponent)
        const p2 = get(l.toEntity, PositionComponent)

        positions[0] = p1.x
        positions[1] = p1.y
        positions[2] = p1.z
        positions[3] = p2.x
        positions[4] = p2.y
        positions[5] = p2.z

        mesh.updateVerticesData(VertexBuffer.PositionKind, positions)
      }
    )
  }
