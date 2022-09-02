import type { ReduxStore, ThunkResult } from 'domain/task/store/store'
import { AmendTaskStatusActions } from './actionCreators'
import { ThrowErrorActions } from 'domain/common/actionCreators'
import { ErrorMapper } from 'domain/error/mapper/error.mapper'
import { UnspecifiedError } from 'domain/task/entity/error'
import type { AmendTaskStatus } from 'domain/task/command/amendTaskStatus'
import type { DeepReadonly } from 'superTypes'

const dispatchError = (error: unknown, dispatch: ReduxStore['dispatch']): void => {
  const errorToDispatch = ErrorMapper.mapRawErrorToEntity(error)
  dispatch(ThrowErrorActions.errorThrown(errorToDispatch))
}

export const amendTaskStatus =
  (amendTaskStatusPayload: DeepReadonly<AmendTaskStatus>): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async (dispatch, getState) => {
    const { id, timestamp = new Date(), status }: AmendTaskStatus = amendTaskStatusPayload
    if (!getState().task.byId.has(id)) {
      dispatchError(
        new UnspecifiedError(
          `Oops.. The provided id '${id}' does not exist, so we can't amend the status of an unknwom task..`
        ),
        dispatch
      )
      return
    }
    dispatch(AmendTaskStatusActions.taskStatusAmended({ id, timestamp, status }))
  }
