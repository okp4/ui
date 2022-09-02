import type { Status } from './type'

export type TaskStatusAmendReceivedPayload<I = string> = {
  readonly id: I
  readonly status: Status
}
