import { Vector3 } from '@babylonjs/core'
import type { Vector } from 'ngraph.forcelayout'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const vector2Vector3: (pos: Vector) => Vector3 = (pos: Vector) =>
  new Vector3(pos.x, pos.y, pos.z ?? 0)

