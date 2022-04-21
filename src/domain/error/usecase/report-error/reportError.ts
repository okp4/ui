import type { ThunkResult } from 'domain/error/store/store'
import type { Error } from 'domain/error/entity/error'
import { ReportErrorActions } from './actionCreators'

export const reportError =
  (error: Error): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async dispatch => {
    dispatch(ReportErrorActions.errorReported(error))
  }
