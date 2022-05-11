import type { ReduxStore, ThunkResult } from 'domain/task/store/store'
import type { Task } from 'domain/task/entity/task'
import { RegisterTaskActions } from './actionCreators'
import { ThrowErrorActions } from 'domain/common/actionCreators'
import { ErrorMapper } from 'domain/error/mapper/error.mapper'
import { UnspecifiedError } from 'domain/task/entity/error'

const dispatchError = (error: unknown, dispatch: ReduxStore['dispatch']): void => {
  const errorToDispatch = ErrorMapper.mapRawErrorToEntity(error)
  dispatch(ThrowErrorActions.errorThrown(errorToDispatch))
}

export const registerTask =
  (task: Task): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async (dispatch, getState) => {
    if (getState().task.byId.has(task.id)) {
      dispatchError(new UnspecifiedError(), dispatch)
      return
    }
    dispatch(RegisterTaskActions.taskRegistered(task))
  }
