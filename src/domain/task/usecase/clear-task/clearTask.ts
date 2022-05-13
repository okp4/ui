import type { ThunkResult } from 'domain/task/store/store'
import { ClearTaskActions } from './actionCreators'

export const clearTask =
  (id: string): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async dispatch => {
    dispatch(ClearTaskActions.taskCleared(id))
  }
