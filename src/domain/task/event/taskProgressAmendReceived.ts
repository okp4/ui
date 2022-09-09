import type { Progress } from './type'

export type TaskProgressAmendReceivedPayload<I = string> = {
  readonly id: I
  readonly progress: Progress
}
