/* eslint-disable max-lines-per-function */
import type { ReduxStore, ThunkResult } from 'domain/task/store/store'
import { ThrowErrorActions } from 'domain/common/actionCreators'
import { ErrorMapper } from 'domain/error/mapper/error.mapper'
import { UnspecifiedError } from 'domain/task/entity/error'
import type { DeepReadonly } from 'superTypes'
import { isProgressValid } from 'domain/task/utils/task.utils'
import { SetTaskProgressValueActions } from '../set-task-progress-value/actionCreators'
import type { SetTaskProgressValue } from 'domain/task/command/setTaskProgressValue'

const dispatchError = (error: unknown, dispatch: ReduxStore['dispatch']): void => {
  const errorToDispatch = ErrorMapper.mapRawErrorToEntity(error)
  dispatch(ThrowErrorActions.errorThrown(errorToDispatch))
}

export const setTaskProgressValue =
  (setTaskProgressValuePayload: DeepReadonly<SetTaskProgressValue>): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async (dispatch, getState) => {
    const {
      id,
      timestamp = new Date(),
      progressValue
    }: SetTaskProgressValue = setTaskProgressValuePayload
    if (!getState().task.byId.has(id)) {
      dispatchError(
        new UnspecifiedError(
          `Oops... The provided id '${id}' does not exist, so we can't set the progress value of an unknown task...`
        ),
        dispatch
      )
      return
    }

    const progressEntity = getState().task.byId.get(id)?.progress
    const progressFuture = { ...progressEntity, current: progressValue }
    if (!isProgressValid(progressFuture)) {
      dispatchError(
        new UnspecifiedError(
          `Oops... The provided progress value '${progressValue}' is not valid, so we can't set the progress value...`
        ),
        dispatch
      )
      return
    }

    dispatch(
      SetTaskProgressValueActions.taskProgressValueSet({
        id,
        timestamp,
        progressValue
      })
    )
  }
