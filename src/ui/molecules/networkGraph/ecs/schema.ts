import { number, registerSchema, string } from '@javelin/ecs'

export enum Schemas {
  Node,
  Link,
  Position,
  Mesh,
  Label
}

const Vector3 = {
  x: number,
  y: number,
  z: number
}

export const Entity = {
  id: number
}

export const NodeComponent = { id: number }
export const LinkComponent = { id: string, fromEntity: number, toEntity: number }

export const PositionComponent = Vector3
export const MeshComponent = {
  id: string,
  name: string
}
export const LabelComponent = {
  label: string
}

registerSchema(NodeComponent, Schemas.Node)
registerSchema(LinkComponent, Schemas.Link)
registerSchema(PositionComponent, Schemas.Position)
registerSchema(MeshComponent, Schemas.Mesh)
registerSchema(LabelComponent, Schemas.Label)
