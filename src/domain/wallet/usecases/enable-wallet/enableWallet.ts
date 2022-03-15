import {
  ConnectionError,
  UnspecifiedError,
} from 'domain/wallet/entities/errors'
import { Accounts, ChainId } from 'domain/wallet/entities/wallet'
import { ReduxStore, ThunkResult } from '../../store/store'
import { ErrorWalletActions } from '../actionCreators'
import { EnableWalletActions } from './actionCreators'

export const enableWallet =
  (chainId: ChainId): ThunkResult<Promise<void>> =>
  async (dispatch, getState, { walletGateway }) => {
    try {
      const result = await walletGateway.connect(chainId)
      if (isError(result)) {
        dispatchError(result, dispatch)
      } else {
        dispatchConnectionStatuses(chainId, dispatch)
        const accounts = await walletGateway.getAccounts(chainId)
        dispatchAccounts(accounts, chainId, dispatch)
      }
    } catch (error) {
      dispatchError(error, dispatch)
    }
  }

const isError = (result: ConnectionError | void): result is ConnectionError =>
  result instanceof ConnectionError

const dispatchAccounts = (
  accounts: Accounts,
  chainId: ChainId,
  dispatch: ReduxStore['dispatch']
) => {
  dispatch(EnableWalletActions.accountsRetrieved(chainId, accounts))
}

const dispatchError = (error: unknown, dispatch: ReduxStore['dispatch']) => {
  const errorToDispatch =
    error instanceof Error ? new ConnectionError() : new UnspecifiedError()
  dispatch(ErrorWalletActions.walletFailed(errorToDispatch))
}

const dispatchConnectionStatuses = (
  chainId: ChainId,
  dispatch: ReduxStore['dispatch']
) => {
  dispatch(EnableWalletActions.walletConnected(chainId))
}
