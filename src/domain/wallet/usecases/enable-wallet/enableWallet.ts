import type { ChainId } from 'domain/wallet/entities/wallet'
import type { WalletId } from 'domain/wallet/ports/walletPort'
import type { ReduxStore, ThunkResult } from 'domain/wallet/store/store'
import { ThrowErrorActions } from 'domain/common/actionCreators'
import { EnableWalletActions } from './actionCreators'
import { ErrorMapper } from 'domain/error/mapper/error.mapper'

const dispatchError = (error: unknown, dispatch: ReduxStore['dispatch']): void => {
  const errorToDispatch = ErrorMapper.mapRawErrorToEntity(error)
  dispatch(ThrowErrorActions.errorThrown(errorToDispatch))
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
