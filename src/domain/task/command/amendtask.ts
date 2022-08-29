import type { TaskStatus } from '../entity/task'

export type AmendTask<I = string> = {
  readonly id: I
  readonly timestamp: Date
  readonly status?: TaskStatus
  readonly messageKey?: string
}
