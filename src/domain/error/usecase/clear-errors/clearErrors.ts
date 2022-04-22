import type { ThunkResult } from 'domain/error/store/store'
import { ClearErrorsActions } from './actionCreators'

export const clearErrors =
  (): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async dispatch => {
    dispatch(ClearErrorsActions.errorsCleared())
  }
