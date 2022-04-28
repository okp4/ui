import { ThrowErrorActions } from 'domain/common/actionCreators'
import { ErrorMapper } from 'domain/error/mapper/error.mapper'
import type { ReduxStore, ThunkResult } from 'domain/faucet/store/store'
import { RequestFundsActions } from './actionCreators'
import { checkOKP4Address } from '../../service/checkOKP4Address'

const dispatchRequestFundsError = (error: unknown, dispatch: ReduxStore['dispatch']): void => {
  const errorToDispatch = ErrorMapper.mapRawErrorToEntity(error)
  dispatch(ThrowErrorActions.errorThrown(errorToDispatch))
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
