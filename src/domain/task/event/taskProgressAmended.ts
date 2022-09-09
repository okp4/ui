import type { Progress } from './type'

export type TaskProgressAmendedPayload<I = string> = {
  readonly id: I
  readonly timestamp: Date
  readonly progress: Progress
}
