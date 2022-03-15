import { ConnectionError } from 'domain/wallet/entities/errors'
import { ChainId } from 'domain/wallet/entities/wallet'
import { ThunkResult } from '../../store/store'
import { ErrorWalletActions } from '../actionCreators'
import { EnableWalletActions } from './actionCreators'

export const enableWallet =
  (chainId: ChainId): ThunkResult<Promise<void>> =>
  async (dispatch, getState, { walletGateway }) => {
    try {
      const result = await walletGateway.enable(chainId)
      if (isError(result)) {
        dispatch(ErrorWalletActions.walletFailed(result))
      } else {
        dispatch(EnableWalletActions.walletEnabled(chainId))
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'unknwon error'
      dispatch(
        ErrorWalletActions.walletFailed(new ConnectionError(errorMessage))
      )
    }
  }

const isError = (result: ConnectionError | void): result is ConnectionError =>
  result instanceof ConnectionError
