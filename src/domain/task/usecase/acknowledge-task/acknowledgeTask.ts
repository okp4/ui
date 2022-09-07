import { ThrowErrorActions } from 'domain/common/actionCreators'
import { ErrorMapper } from 'domain/error/mapper/error.mapper'
import type { AcknowledgeTask } from 'domain/task/command/acknowledgeTask'
import { UnspecifiedError } from 'domain/task/entity/error'
import type { ReduxStore, ThunkResult } from 'domain/task/store/store'
import { AcknowledgeTaskActions } from './actionCreators'

const dispatchError = (error: unknown, dispatch: ReduxStore['dispatch']): void => {
  const errorToDispatch = ErrorMapper.mapRawErrorToEntity(error)
  dispatch(ThrowErrorActions.errorThrown(errorToDispatch))
}

export const acknowledgeTask =
  (acknowledgeTaskPayload: Readonly<AcknowledgeTask>): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async (dispatch, getState) => {
    const { id }: AcknowledgeTask = acknowledgeTaskPayload
    if (!getState().displayedTaskIds.has(id)) {
      dispatchError(
        new UnspecifiedError(
          `Oops.. The provided id '${id}' does not exist, so we can't acknowledge this task..`
        ),
        dispatch
      )
      return
    }
    dispatch(AcknowledgeTaskActions.taskAcknowledged({ id }))
  }
