import { ThrowErrorActions } from 'domain/common/actionCreators'
import { ErrorMapper } from 'domain/error/mapper/error.mapper'
import type { RemoveTasks } from 'domain/task/command/removeTasks'
import { UnspecifiedError } from 'domain/task/entity/error'
import type { Task } from 'domain/task/entity/task'
import type { ReduxStore, ThunkResult } from 'domain/task/store/store'
import type { DeepReadonly } from 'superTypes'
import { RemoveTaskActions } from '../remove-task/actionCreators'

const dispatchError = (error: unknown, dispatch: ReduxStore['dispatch']): void => {
  const errorToDispatch = ErrorMapper.mapRawErrorToEntity(error)
  dispatch(ThrowErrorActions.errorThrown(errorToDispatch))
}

export const removeTasks =
  (removeTasksPayload?: DeepReadonly<RemoveTasks>): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async (dispatch, getState) => {
    if (!removeTasksPayload) {
      getState().task.byId.forEach((_task: Task, id: string) => {
        dispatch(RemoveTaskActions.taskRemoved({ id }))
      })
      return
    }

    if (!removeTasksPayload.every((id: string) => getState().task.byId.keySeq().includes(id))) {
      dispatchError(
        new UnspecifiedError(
          `Oops.. The provided list of id's '${JSON.stringify(
            removeTasksPayload
          )}' contains at least an id that does not exist, so we can't remove these tasks..`
        ),
        dispatch
      )
      return
    }

    removeTasksPayload.forEach((id: string) => {
      dispatch(RemoveTaskActions.taskRemoved({ id }))
    })
  }
