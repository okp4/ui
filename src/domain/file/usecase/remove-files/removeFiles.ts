import type { ThunkResult } from 'domain/file/store/store'
import { RemoveFilesActions } from './actionCreators'

export const removeFiles =
  (): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async dispatch => {
    dispatch(RemoveFilesActions.filesRemoved())
  }
