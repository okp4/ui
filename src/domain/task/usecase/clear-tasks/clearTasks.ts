import type { ThunkResult } from 'domain/task/store/store'
import { ClearTasksActions } from './actionCreators'

export const clearTasks =
  (): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async dispatch => {
    dispatch(ClearTasksActions.tasksCleared())
  }
