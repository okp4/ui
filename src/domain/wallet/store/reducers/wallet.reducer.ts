import { Map } from 'immutable'
import { combineReducers } from 'redux'
import type { AccountsByChainId, ConnectionStatuses } from 'domain/wallet/entities/wallet'
import type { EnableWalletActionTypes } from 'domain/wallet/usecases/enable-wallet/actionCreators'
import type { DeepReadonly } from 'superTypes'

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

const rootReducer = combineReducers({ connectionStatuses, accounts })

export default rootReducer
