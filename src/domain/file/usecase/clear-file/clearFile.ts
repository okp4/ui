import type { ThunkResult } from 'domain/file/store/store'
import { ClearFilections } from './actionCreators'

export const clearFile =
  (id: string): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async dispatch => {
    dispatch(ClearFilections.fileCleared(id))
  }
