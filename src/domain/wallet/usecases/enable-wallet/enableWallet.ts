import { UnspecifiedError } from 'domain/wallet/entities/errors'
import { ChainId } from 'domain/wallet/entities/wallet'
import { WalletId } from 'domain/wallet/ports/walletPort'
import { ReduxStore, ThunkResult } from '../../store/store'
import { ErrorWalletActions } from '../actionCreators'
import { EnableWalletActions } from './actionCreators'

export const enableWallet =
  (walletId: WalletId, chainId: ChainId): ThunkResult<Promise<void>> =>
  async (dispatch, _getState, { walletRegistryGateway }) => {
    try {
      const wallet = walletRegistryGateway.get(walletId)
      await wallet.connect(chainId)
      dispatch(EnableWalletActions.walletConnected(chainId))
      const accounts = await wallet.getAccounts(chainId)
      dispatch(EnableWalletActions.accountsRetrieved(chainId, accounts))
    } catch (error) {
      dispatchError(error, dispatch)
    }
  }

const dispatchError = (error: unknown, dispatch: ReduxStore['dispatch']) => {
  const errorToDispatch =
    error instanceof Error ? error : new UnspecifiedError()
  dispatch(ErrorWalletActions.walletFailed(errorToDispatch))
}
