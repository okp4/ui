import { OrderedSet, OrderedMap } from 'immutable'
import { combineReducers } from 'redux'
import type { Task } from 'domain/task/entity/task'
import type { ClearTaskActionTypes } from 'domain/task/usecase/clear-task/actionCreators'
import type { ClearTaskskActionTypes } from 'domain/task/usecase/clear-tasks/actionCreators'
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
  action: DeepReadonly<RegisterTaskActionTypes | ClearTaskskActionTypes | ClearTaskActionTypes>
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
    case 'task/taskCleared': {
      const foundTaskById = state.byId.get(action.payload)
      return {
        ...state,
        ...(foundTaskById && {
          byId: state.byId.remove(action.payload),
          byType: state.byType
            .map((value: Readonly<OrderedSet<string>>) => value.delete(action.payload))
            .filter((value: Readonly<OrderedSet<string>>) => !value.isEmpty())
        })
      }
    }
    case 'task/tasksCleared':
      return {
        ...state,
        byId: state.byId.clear(),
        byType: state.byType.clear()
      }
    default:
      return state
  }
}

const displayedTaskIds = (
  state: Readonly<OrderedSet<string>> = OrderedSet(),
  action: DeepReadonly<RegisterTaskActionTypes | ClearTaskskActionTypes | ClearTaskActionTypes>
): OrderedSet<string> => {
  switch (action.type) {
    case 'task/taskRegistered':
      return state.add(action.payload.task.id)
    case 'task/tasksCleared':
      return state.clear()
    case 'task/taskCleared':
      return state.delete(action.payload)
    default:
      return state
  }
}

const rootReducer = combineReducers({ task, displayedTaskIds })

export default rootReducer
