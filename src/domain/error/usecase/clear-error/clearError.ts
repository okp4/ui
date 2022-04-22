import type { Id } from 'domain/error/entity/error'
import type { ThunkResult } from 'domain/error/store/store'
import { ClearErrorActions } from './actionCreators'

export const clearError =
  (id: Id): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async dispatch => {
    dispatch(ClearErrorActions.errorCleared(id))
  }
