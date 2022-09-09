import type { Progress } from './type'

export type TaskProgressBounds = Partial<Omit<Progress, 'current'>>

export type ConfigureTaskProgressBounds<I = string> = {
  readonly id: I
  readonly progressBounds: TaskProgressBounds
}
