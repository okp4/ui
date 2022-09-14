import type { Progress } from './type'

type ProgressBounds = Omit<Progress, 'current'>

export type TaskProgressBoundsConfiguredPayload<I = string> = {
  readonly id: I
  readonly timestamp: Date
  readonly progressBounds: ProgressBounds
}
