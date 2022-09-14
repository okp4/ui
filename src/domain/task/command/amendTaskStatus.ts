import type { Status } from './type'

export type AmendTaskStatus<I = string> = {
  readonly id: I
  readonly timestamp?: Date
  readonly status: Status
}
