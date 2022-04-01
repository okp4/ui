import { Map } from 'immutable'
import { combineReducers } from 'redux'
import type { AccountsByChainId, ConnectionStatuses } from '../../entities/wallet'
import type { EnableWalletActionTypes } from '../../usecases/enable-wallet/actionCreators'
import type { ErrorWalletActionTypes } from '../../usecases/actionCreators'
import type { DeepReadonly } from '../../../../superTypes'

const connectionStatuses = (
  state: Readonly<ConnectionStatuses> = Map(),
  action: DeepReadonly<EnableWalletActionTypes>
): ConnectionStatuses => {
  switch (action.type) {
    case 'wallet/walletConnected':
      return state.set(action.payload.chaindId, 'connected')
    default:
      return state
  }
}

const accounts = (
  state: Readonly<AccountsByChainId> = Map(),
  action: DeepReadonly<EnableWalletActionTypes>
): AccountsByChainId => {
  switch (action.type) {
    case 'wallet/accountsRetrieved':
      return state.set(action.payload.chainId, action.payload.accounts)
    default:
      return state
  }
}

const error = (
  state: DeepReadonly<Error> | null = null,
  action: DeepReadonly<ErrorWalletActionTypes>
): Error | null => {
  switch (action.type) {
    case 'wallet/walletFailed':
      return action.payload.error
    default:
      return state
  }
}
const rootReducer = combineReducers({ connectionStatuses, accounts, error })

export default rootReducer
