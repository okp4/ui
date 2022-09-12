/* eslint-disable max-lines-per-function */
import type { ReduxStore, ThunkResult } from 'domain/task/store/store'
import { RegisterTaskActions } from './actionCreators'
import { ThrowErrorActions } from 'domain/common/actionCreators'
import { ErrorMapper } from 'domain/error/mapper/error.mapper'
import { UnspecifiedError } from 'domain/task/entity/error'
import type { RegisterTask } from 'domain/task/command/registerTask'
import type { DeepReadonly } from 'superTypes'
import { progressInvariant } from 'domain/task/utils/task.utils'
import { ConfigureTaskProgressBoundsActions } from '../configure-task-progress-bounds/actionCreators'
import type { Progress } from 'domain/task/command/type'
import { SetTaskProgressValueActions } from '../set-task-progress-value/actionCreators'

const dispatchError = (error: unknown, dispatch: ReduxStore['dispatch']): void => {
  const errorToDispatch = ErrorMapper.mapRawErrorToEntity(error)
  dispatch(ThrowErrorActions.errorThrown(errorToDispatch))
}

export const registerTask =
  (registerTaskPayload: DeepReadonly<RegisterTask>): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async (dispatch, getState) => {
    const {
      id,
      timestamp = new Date(),
      type,
      initiator,
      progress
    }: RegisterTask = registerTaskPayload
    if (getState().task.byId.has(id)) {
      dispatchError(
        new UnspecifiedError(
          `Oops.. The provided id '${id}' already exists, so we can't perform a task registering..`
        ),
        dispatch
      )
      return
    }
    if (progress && !progressInvariant(progress)) {
      dispatchError(
        new UnspecifiedError(
          `Oops.. The provided progress object '${JSON.stringify(
            progress
          )}' is not valid, so we can't perform a task registering..`
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

    if (progress) {
      const { min, max, current }: Progress = progress

      if (max !== undefined || min !== undefined) {
        dispatch(
          ConfigureTaskProgressBoundsActions.taskProgressBoundsConfigured({
            id,
            timestamp,
            progressBounds: { max, min }
          })
        )
      }
      if (current !== undefined) {
        dispatch(
          SetTaskProgressValueActions.taskProgressValueSet({
            id,
            timestamp,
            progressValue: current
          })
        )
      }
    }
  }
