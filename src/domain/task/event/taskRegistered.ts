import type { Status } from './type'

export type TaskRegisteredPayload<T = string, I = string> = {
  readonly id: I
  readonly timestamp: Date
  readonly type: T
  readonly initiator: string
  readonly status: Status
}
