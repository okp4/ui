import type { ThunkResult } from 'domain/task/store/store'
import { ClearFilesActions } from './actionCreators'

export const clearFiles =
  (): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async dispatch => {
    dispatch(ClearFilesActions.filesCleared())
  }
