import type { ReduxStore, ThunkResult } from 'domain/task/store/store'
import { RegisterTaskActions } from './actionCreators'
import { ThrowErrorActions } from 'domain/common/actionCreators'
import { ErrorMapper } from 'domain/error/mapper/error.mapper'
import { UnspecifiedError } from 'domain/task/entity/error'
import type { RegisterTask } from 'domain/task/command/registerTask'
import type { DeepReadonly } from 'superTypes'

const dispatchError = (error: unknown, dispatch: ReduxStore['dispatch']): void => {
  const errorToDispatch = ErrorMapper.mapRawErrorToEntity(error)
  dispatch(ThrowErrorActions.errorThrown(errorToDispatch))
}

export const registerTask =
  (registerTaskPayload: DeepReadonly<RegisterTask>): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async (dispatch, getState) => {
    const { id, timestamp = new Date(), type, initiator }: RegisterTask = registerTaskPayload
    if (getState().task.byId.has(id)) {
      dispatchError(
        new UnspecifiedError(
          `Oops.. The provided id '${id}' already exists, so we can't perform a task registering..`
        ),
        dispatch
      )
      return
    }

    dispatch(
      RegisterTaskActions.taskRegistered({
        id,
        timestamp,
        initiator,
        status: 'processing',
        type
      })
    )
  }
