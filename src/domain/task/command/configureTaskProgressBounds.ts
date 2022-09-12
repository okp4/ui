import type { Progress } from './type'

export type ProgressBounds = Omit<Progress, 'current'>

export type ConfigureTaskProgressBounds<I = string> = {
  readonly id: I
  readonly timestamp?: Date
  readonly progressBounds: ProgressBounds
}
