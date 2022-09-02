import type { ReduxStore, ThunkResult } from 'domain/task/store/store'
import type { RemoveTask } from 'domain/task/command/removeTask'
import { ErrorMapper } from 'domain/error/mapper/error.mapper'
import { ThrowErrorActions } from 'domain/common/actionCreators'
import type { DeepReadonly } from 'superTypes'
import { RemoveTaskActions } from './actionCreators'
import { UnspecifiedError } from 'domain/task/entity/error'

const dispatchError = (error: unknown, dispatch: ReduxStore['dispatch']): void => {
  const errorToDispatch = ErrorMapper.mapRawErrorToEntity(error)
  dispatch(ThrowErrorActions.errorThrown(errorToDispatch))
}

export const removeTask =
  (removeTaskPayload: DeepReadonly<RemoveTask>): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async (dispatch, getState) => {
    const { id }: RemoveTask = removeTaskPayload
    if (!getState().task.byId.has(id)) {
      dispatchError(
        new UnspecifiedError(
          `Oops.. The provided id '${id}' does not exist, so we can't remove an unknwom task..`
        ),
        dispatch
      )
      return
    }

    dispatch(RemoveTaskActions.taskRemoved({ id }))
  }
