/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import { Vector3 } from '@babylonjs/core'
import type { Vector } from 'ngraph.forcelayout'

export const vector2Vector3: (pos: Vector) => Vector3 = (pos: Vector) =>
  new Vector3(pos.x, pos.y, pos.z ?? 0)

