import {
  ConnectionError,
  UnspecifiedError,
} from 'domain/wallet/entities/errors'
import { Accounts, ChainId } from 'domain/wallet/entities/wallet'
import { WalletId } from 'domain/wallet/ports/walletPort'
import { ReduxStore, ThunkResult } from '../../store/store'
import { ErrorWalletActions } from '../actionCreators'
import { EnableWalletActions } from './actionCreators'

export const enableWallet =
  (walletId: WalletId, chainId: ChainId): ThunkResult<Promise<void>> =>
  async (dispatch, _getState, { walletRegistryGateway }) => {
    try {
      const gateway = walletRegistryGateway.get(walletId)
      if (isError(gateway)) {
        dispatchError(gateway, dispatch)
        return
      }
      const result = await gateway.connect(chainId)
      if (isError(result)) {
        dispatchError(result, dispatch)
        return
      }
      dispatchConnectionStatuses(chainId, dispatch)
      const accounts = await gateway.getAccounts(chainId)
      dispatchAccounts(accounts, chainId, dispatch)
    } catch (error) {
      dispatchError(error, dispatch)
    }
  }

const isError = (result: unknown): result is Error => result instanceof Error

const dispatchAccounts = (
  accounts: Accounts | ConnectionError,
  chainId: ChainId,
  dispatch: ReduxStore['dispatch']
) => {
  isError(accounts)
    ? dispatchError(accounts, dispatch)
    : dispatch(EnableWalletActions.accountsRetrieved(chainId, accounts))
}

const dispatchError = (error: unknown, dispatch: ReduxStore['dispatch']) => {
  const errorToDispatch =
    error instanceof Error ? error : new UnspecifiedError()
  dispatch(ErrorWalletActions.walletFailed(errorToDispatch))
}

const dispatchConnectionStatuses = (
  chainId: ChainId,
  dispatch: ReduxStore['dispatch']
) => {
  dispatch(EnableWalletActions.walletConnected(chainId))
}
