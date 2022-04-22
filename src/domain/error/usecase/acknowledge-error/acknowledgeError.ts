import type { ThunkResult } from 'domain/error/store/store'
import { AcknowledgeErrorActions } from './actionCreators'

export const acknowledgeError =
  (): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async dispatch => {
    dispatch(AcknowledgeErrorActions.errorAcknowledged())
  }
