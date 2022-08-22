import type { ThunkResult } from 'domain/file/store/store'
import { RemoveFileActions } from './actionCreators'

export const removeFile =
  (id: string): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async dispatch => {
    dispatch(RemoveFileActions.fileRemoved(id))
  }
