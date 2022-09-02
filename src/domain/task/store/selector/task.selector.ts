import { createSelector } from 'reselect'
import type { AppState, TaskById, TaskByType } from '../appState'
import type { DeepReadonly } from 'superTypes'
import type { OrderedSet } from 'immutable'

type Status = 'processing' | 'success' | 'error'

const rootSelector = (state: DeepReadonly<AppState>): AppState => state

export const getTaskStatusById: (state: DeepReadonly<AppState>, id: string) => Status | undefined =
  createSelector(
    [
      (state: DeepReadonly<AppState>): TaskById => state.task.byId,
      (_state: DeepReadonly<AppState>, id: string): string => id
    ],
    (tasks: DeepReadonly<TaskById>, id: string) => tasks.get(id)?.status
  )

export const getTaskIdsByType: (
  state: DeepReadonly<AppState>,
  type: string
) => OrderedSet<string> | undefined = createSelector(
  [
    (state: DeepReadonly<AppState>): TaskByType => state.task.byType,
    (_state: DeepReadonly<AppState>, type: string): string => type
  ],
  (tasks: DeepReadonly<TaskByType>, type: string) => tasks.get(type)
)

// Get only first displayed Id by a specified type and status
export const getDisplayedTaskIdByTypeAndStatus: (
  state: DeepReadonly<AppState>,
  type: string,
  status: Status
) => string | undefined = createSelector(
  [
    rootSelector,
    (state: DeepReadonly<AppState>, type: string): OrderedSet<string> | undefined =>
      getTaskIdsByType(state, type),
    (_state: DeepReadonly<AppState>, _type: string, status: Status): Status => status
  ],
  (
    state: DeepReadonly<AppState>,
    taskIdsByType: DeepReadonly<OrderedSet<string> | undefined>,
    status: Status
  ): string | undefined =>
    state.displayedTaskIds.find(
      (id: string) =>
        (taskIdsByType?.includes(id) && getTaskStatusById(state, id) === status) ?? false
    )
)
