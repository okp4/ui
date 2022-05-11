import type { OrderedSet, OrderedMap } from 'immutable'
import type { Task } from '../entity/task'

export type AppState<T = string, I = string> = {
  readonly task: TaskState<T, I>
  readonly unseenTaskId: I | null
}

export type TaskState<T = string, I = string> = {
  readonly byId: TaskById<I>
  readonly byType: TaskByType<T, I>
}

export type TaskById<I = string> = OrderedMap<I, Task>
export type TaskByType<T = string, I = string> = OrderedMap<T, OrderedSet<I>>
