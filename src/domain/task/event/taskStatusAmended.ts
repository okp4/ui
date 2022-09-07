import type { Status } from './type'

export type TaskStatusAmendedPayload<I = string> = {
  readonly id: I
  readonly timestamp: Date
  readonly status: Status
}
