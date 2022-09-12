/* eslint-disable max-lines-per-function */
import type { ReduxStore, ThunkResult } from 'domain/task/store/store'
import { ThrowErrorActions } from 'domain/common/actionCreators'
import { ErrorMapper } from 'domain/error/mapper/error.mapper'
import { UnspecifiedError } from 'domain/task/entity/error'
import type { DeepReadonly } from 'superTypes'
import { progressInvariant } from 'domain/task/utils/task.utils'
import type { ConfigureTaskProgressBounds } from 'domain/task/command/configureTaskProgressBounds'
import { ConfigureTaskProgressBoundsActions } from './actionCreators'

const dispatchError = (error: unknown, dispatch: ReduxStore['dispatch']): void => {
  const errorToDispatch = ErrorMapper.mapRawErrorToEntity(error)
  dispatch(ThrowErrorActions.errorThrown(errorToDispatch))
}

export const configureTaskProgressBounds =
  (
    configureTaskProgressBoundsPayload: DeepReadonly<ConfigureTaskProgressBounds>
  ): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async (dispatch, getState) => {
    const {
      id,
      timestamp = new Date(),
      progressBounds
    }: ConfigureTaskProgressBounds = configureTaskProgressBoundsPayload
    if (!getState().task.byId.has(id)) {
      dispatchError(
        new UnspecifiedError(
          `Oops.. The provided id '${id}' does not exist, so we can't configure the progress bounds of an unknown task..`
        ),
        dispatch
      )
      return
    }

    if (Object.keys(progressBounds).length > 0) {
      const progressEntity = getState().task.byId.get(id)?.progress
      const progressFuture = { ...progressEntity, ...progressBounds }

      if (!progressInvariant(progressFuture)) {
        dispatchError(
          new UnspecifiedError(
            `Oops.. The provided progress bounds '${JSON.stringify(
              progressBounds
            )}' are not valid, so we can't configure the progress bounds..`
          ),
          dispatch
        )
        return
      }

      dispatch(
        ConfigureTaskProgressBoundsActions.taskProgressBoundsConfigured({
          id,
          timestamp,
          progressBounds
        })
      )
    }
  }
