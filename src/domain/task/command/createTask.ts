import type { TaskStatus } from '../entity/task'

export type CreateTask<I = string, T = string> = {
  readonly id: I
  readonly timestamp: Date
  readonly type: T
  readonly status: TaskStatus
  readonly messageKey: string
  readonly initiator?: string
}
