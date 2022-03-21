import { UnspecifiedError } from 'domain/wallet/entities/errors'
import type { ChainId } from 'domain/wallet/entities/wallet'
import type { WalletId } from 'domain/wallet/ports/walletPort'
import type { ReduxStore, ThunkResult } from '../../store/store'
import { ErrorWalletActions } from '../actionCreators'
import { EnableWalletActions } from './actionCreators'

const dispatchError = (error: unknown, dispatch: ReduxStore['dispatch']): void => {
  const errorToDispatch = error instanceof Error ? error : new UnspecifiedError()
  dispatch(ErrorWalletActions.walletFailed(errorToDispatch))
}

export const enableWallet =
  (walletId: WalletId, chainId: ChainId): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async (dispatch, _getState, { walletRegistryGateway }) => {
    try {
      const wallet = walletRegistryGateway.get(walletId)
      await wallet.connect(chainId)
      dispatch(EnableWalletActions.walletConnected(chainId))
      const accounts = await wallet.getAccounts(chainId)
      dispatch(EnableWalletActions.accountsRetrieved(chainId, accounts))
    } catch (error: unknown) {
      dispatchError(error, dispatch)
    }
  }
