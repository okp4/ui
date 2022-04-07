import { UnspecifiedError } from 'domain/faucet/entity/error'
import type { ReduxStore, ThunkResult } from '../../store/store'
import { RequestFundsActions } from './actionCreators'
import { checkOKP4Address } from '../../service/checkOKP4Address'

const dispatchRequestFundsError = (error: unknown, dispatch: ReduxStore['dispatch']): void => {
  const errorToDispatch = error instanceof Error ? error : new UnspecifiedError()
  dispatch(RequestFundsActions.requestFundsFailed(errorToDispatch))
}

export const requestFunds =
  (address: string): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async (dispatch, _getState, { faucetGateway }) => {
    try {
      checkOKP4Address(address)
      dispatch(RequestFundsActions.requestFundsProceeded())
      await faucetGateway.requestFunds(address)
      dispatch(RequestFundsActions.requestFundsSucceeded())
    } catch (error: unknown) {
      dispatchRequestFundsError(error, dispatch)
    }
  }
