import type { ReduxStore, ThunkResult } from 'domain/task/store/store'
import { UpdateTaskActions } from './actionCreators'
import { ThrowErrorActions } from 'domain/common/actionCreators'
import { ErrorMapper } from 'domain/error/mapper/error.mapper'
import { UnspecifiedError } from 'domain/task/entity/error'
import type { AmendTask } from 'domain/task/command/createTask'
import type { DeepReadonly } from 'superTypes'
import { TaskMapper } from 'adapters/task/mapper/task.mapper'

const dispatchError = (error: unknown, dispatch: ReduxStore['dispatch']): void => {
  const errorToDispatch = ErrorMapper.mapRawErrorToEntity(error)
  dispatch(ThrowErrorActions.errorThrown(errorToDispatch))
}

export const updateTask =
  (task: DeepReadonly<AmendTask>): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async (dispatch, getState) => {
    if (!getState().task.byId.has(task.id)) {
      dispatchError(
        new UnspecifiedError(
          `Oops.. The provided id '${task.id}' does not exist, so we can't perform a task update..`
        ),
        dispatch
      )
      return
    }
    dispatch(UpdateTaskActions.taskUpdated(TaskMapper.mapAmendTaskToEntity(task)))
  }
