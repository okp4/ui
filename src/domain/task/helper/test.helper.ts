/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { OrderedSet } from 'immutable'
import type { DeepReadonly } from 'superTypes'
import type { Task } from '../entity/task'
import type { AppState } from '../store/appState'

// Compute state after invoking removeTask* commands
export const getExpectedStateAfterRemove = (
  initialState: DeepReadonly<AppState>,
  tasks: DeepReadonly<Task[]>,
  errorIndex?: number
): AppState =>
  tasks.reduce<AppState>((acc: DeepReadonly<AppState>, cur: Task, index: number): AppState => {
    const foundTask = acc.task.byId.get(cur.id)
    return index !== errorIndex
      ? {
          task: {
            byId: foundTask ? acc.task.byId.remove(cur.id) : acc.task.byId,
            byType: acc.task.byType
              .map((value: Readonly<OrderedSet<string>>) => value.delete(cur.id))
              .filter((value: Readonly<OrderedSet<string>>) => !value.isEmpty())
          },
          displayedTaskIds: acc.displayedTaskIds.remove(cur.id)
        }
      : acc
  }, initialState)

export const getExpectedStateAfterAmend = (
  initialState: DeepReadonly<AppState>,
  tasks: DeepReadonly<Task[]>,
  errorIndex?: number
): AppState =>
  tasks.reduce<AppState>((acc: DeepReadonly<AppState>, cur: Task, index: number): AppState => {
    const foundTask = acc.task.byId.get(cur.id)
    return index !== errorIndex
      ? {
          task: {
            byId: foundTask ? acc.task.byId.set(cur.id, { ...foundTask, ...cur }) : acc.task.byId,
            byType: acc.task.byType
          },
          displayedTaskIds: acc.displayedTaskIds.add(cur.id)
        }
      : acc
  }, initialState)
