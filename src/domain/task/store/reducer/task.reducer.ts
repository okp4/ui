import { OrderedSet, OrderedMap } from 'immutable'
import { combineReducers } from 'redux'
import type { Task } from 'domain/task/entity/task'
import type { AcknowledgeTaskActionTypes } from 'domain/task/usecase/acknowledge-task/actionCreators'
import type { RemoveTaskActionTypes } from 'domain/task/usecase/remove-task/actionCreators'
import type { RegisterTaskActionTypes } from 'domain/task/usecase/register-task/actionCreators'
import type { AmendTaskStatusActionTypes } from 'domain/task/usecase/amend-task-status/actionCreators'
import type { DeepReadonly } from 'superTypes'
import type { TaskState } from '../appState'
import type { TaskRegisteredPayload } from 'domain/task/event/taskRegistered'
import type { TaskStatusAmendedPayload } from 'domain/task/event/taskStatusAmended'
import type { TaskRemovedPayload } from 'domain/task/event/taskRemoved'

const initialTaskState: TaskState<string, string> = {
  byId: OrderedMap<string, Task>(),
  byType: OrderedMap<string, OrderedSet<string>>()
}

const registerTask = (
  state: DeepReadonly<TaskState>,
  payload: DeepReadonly<TaskRegisteredPayload>
): TaskState => {
  const { id, type, timestamp, initiator, status }: TaskRegisteredPayload = payload
  const foundList = state.byType.get(type)
  const task: Task = {
    id,
    creationDate: timestamp,
    lastUpdateDate: timestamp,
    initiator,
    status,
    type
  }
  return {
    ...state,
    byId: state.byId.set(id, task),
    byType: state.byType.set(type, foundList?.size ? foundList.add(id) : OrderedSet([id]))
  }
}

const amendTaskStatus = (
  state: DeepReadonly<TaskState>,
  payload: DeepReadonly<TaskStatusAmendedPayload>
): TaskState => {
  const { id, timestamp, status }: TaskStatusAmendedPayload = payload
  const foundTaskById = state.byId.get(id)
  return {
    ...state,
    ...(foundTaskById && {
      byId: state.byId.set(id, { ...foundTaskById, status, lastUpdateDate: timestamp })
    })
  }
}

const removeTask = (
  state: DeepReadonly<TaskState>,
  payload: DeepReadonly<TaskRemovedPayload>
): TaskState => {
  const { id }: TaskRemovedPayload = payload
  const foundTaskById = state.byId.get(id)
  return {
    ...state,
    ...(foundTaskById && {
      byId: state.byId.remove(id),
      byType: state.byType
        .map((value: Readonly<OrderedSet<string>>) => value.delete(id))
        .filter((value: Readonly<OrderedSet<string>>) => !value.isEmpty())
    })
  }
}

const task = (
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  state: TaskState = initialTaskState,
  action: DeepReadonly<RegisterTaskActionTypes | RemoveTaskActionTypes | AmendTaskStatusActionTypes>
): TaskState => {
  switch (action.type) {
    case 'task/taskRegistered':
      return registerTask(state, action.payload)

    case 'task/taskStatusAmended':
      return amendTaskStatus(state, action.payload)

    case 'task/taskRemoved':
      return removeTask(state, action.payload)

    default:
      return state
  }
}

const displayedTaskIds = (
  state: Readonly<OrderedSet<string>> = OrderedSet(),
  action: DeepReadonly<
    | RegisterTaskActionTypes
    | RemoveTaskActionTypes
    | AmendTaskStatusActionTypes
    | AcknowledgeTaskActionTypes
  >
): OrderedSet<string> => {
  switch (action.type) {
    case 'task/taskRegistered':
      return state.add(action.payload.id)

    case 'task/taskRemoved':
      return state.delete(action.payload.id)

    case 'task/taskStatusAmended':
      return state.add(action.payload.id)

    case 'task/taskAcknowledged':
      return state.remove(action.payload.id)

    default:
      return state
  }
}

const rootReducer = combineReducers({ task, displayedTaskIds })

export default rootReducer
