import type { List } from 'immutable'
import type { Entity } from 'domain/common/type'

export type TaskStatus = 'processing' | 'success' | 'error'

export type Task<T = string, I = string> = Entity<
  {
    readonly creationDate: Date
    readonly lastUpdateDate: Date
    readonly type: T
    readonly status: TaskStatus
    readonly messageKey: string
    readonly initiator?: string
  },
  I
>

export type UpdateTask = Pick<Task, 'id' | 'lastUpdateDate'> &
  Partial<Pick<Task, 'messageKey' | 'status'>>

export type Tasks<T = string, I = string> = List<Task<T, I>>
