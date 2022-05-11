import { OrderedSet, OrderedMap } from 'immutable'
import { combineReducers } from 'redux'
import type { Task } from 'domain/task/entity/task'
import type { RegisterTaskActionTypes } from 'domain/task/usecase/register-task/actionCreators'
import type { DeepReadonly } from 'superTypes'
import type { TaskState } from '../appState'

const initialTaskState: TaskState<string, string> = {
  byId: OrderedMap<string, Task>(),
  byType: OrderedMap<string, OrderedSet<string>>()
}

const task = (
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  state: TaskState = initialTaskState,
  action: DeepReadonly<RegisterTaskActionTypes>
): TaskState => {
  switch (action.type) {
    case 'task/taskRegistered': {
      const foundList = state.byType.get(action.payload.task.type)
      return {
        ...state,
        byId: state.byId.set(action.payload.task.id, action.payload.task),
        byType: state.byType.set(
          action.payload.task.type,
          foundList?.size
            ? foundList.add(action.payload.task.id)
            : OrderedSet([action.payload.task.id])
        )
      }
    }
    default:
      return state
  }
}

const unseenTaskId = (
  state: string | null = null,
  action: DeepReadonly<RegisterTaskActionTypes>
): string | null => {
  switch (action.type) {
    case 'task/taskRegistered':
      return action.payload.task.id
    default:
      return state
  }
}

const rootReducer = combineReducers({ task, unseenTaskId })

export default rootReducer
