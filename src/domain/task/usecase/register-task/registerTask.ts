import type { ReduxStore, ThunkResult } from 'domain/task/store/store'
import { RegisterTaskActions } from './actionCreators'
import { ThrowErrorActions } from 'domain/common/actionCreators'
import { ErrorMapper } from 'domain/error/mapper/error.mapper'
import { UnspecifiedError } from 'domain/task/entity/error'
import type { CreateTask } from 'domain/task/command/createTask'
import { TaskMapper } from 'adapters/task/mapper/task.mapper'
import type { DeepReadonly } from 'superTypes'

const dispatchError = (error: unknown, dispatch: ReduxStore['dispatch']): void => {
  const errorToDispatch = ErrorMapper.mapRawErrorToEntity(error)
  dispatch(ThrowErrorActions.errorThrown(errorToDispatch))
}

export const registerTask =
  (task: DeepReadonly<CreateTask>): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async (dispatch, getState) => {
    if (getState().task.byId.has(task.id)) {
      dispatchError(
        new UnspecifiedError(
          `Oops.. The provided id '${task.id}' already exists, so we can't perform a task register..`
        ),
        dispatch
      )
      return
    }
    dispatch(RegisterTaskActions.taskRegistered(TaskMapper.mapCreateTaskToEntity(task)))
  }
