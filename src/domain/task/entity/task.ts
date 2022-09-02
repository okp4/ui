import type { List } from 'immutable'
import type { Entity } from 'domain/common/type'

export type TaskStatus = 'processing' | 'success' | 'error'

export type Task<T = string, I = string> = Entity<
  {
    readonly creationDate: Date
    readonly lastUpdateDate: Date
    readonly type: T
    readonly status: TaskStatus
    readonly initiator: string
  },
  I
>

export type Tasks<T = string, I = string> = List<Task<T, I>>
