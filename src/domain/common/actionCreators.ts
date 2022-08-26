/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { Error } from 'domain/error/entity/error'
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'
import type { TypedBusEvent } from 'eventBus/eventBus'
import type { DeepReadonly } from 'superTypes'
import type { UpdateTask } from 'domain/task/entity/task'
import type { CreateTask } from 'domain/task/command/createTask'

export const ThrowErrorActions = {
  errorThrown: (error: Error) => createAction('error/errorThrown', error)
}

export const TaskActions = {
  taskCreated: (task: DeepReadonly<CreateTask>) => createAction('task/taskCreated', task),
  taskAmended: (task: UpdateTask) => createAction('task/taskAmended', task)
}

export type ThrowErrorActionTypes = ActionsUnion<typeof ThrowErrorActions>
export type ErrorThrownEvent = TypedBusEvent<
  DeepReadonly<ReturnType<typeof ThrowErrorActions['errorThrown']>>
>

export type TaskActionTypes = ActionsUnion<typeof TaskActions>
export type TaskCreatedEvent = TypedBusEvent<
  DeepReadonly<ReturnType<typeof TaskActions['taskCreated']>>
>
export type TaskAmendedEvent = TypedBusEvent<
  DeepReadonly<ReturnType<typeof TaskActions['taskAmended']>>
>
