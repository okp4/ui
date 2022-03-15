import { combineReducers } from 'redux'
import {
  ConnectionError,
  UnspecifiedError,
} from 'domain/wallet/entities/errors'
import {
  AccountsByChainId,
  ConnectionStatuses,
} from 'domain/wallet/entities/wallet'
import { EnableWalletActionTypes } from '../../usecases/enable-wallet/actionCreators'
import { ErrorWalletActionTypes } from '../../usecases/actionCreators'

const connectionStatuses = (
  state: ConnectionStatuses = {},
  action: EnableWalletActionTypes
) => {
  switch (action.type) {
    case 'wallet/walletConnected':
      return { ...state, [action.payload.chaindId]: 'connected' }
    default:
      return state
  }
}

const accounts = (
  state: AccountsByChainId = {},
  action: EnableWalletActionTypes
) => {
  switch (action.type) {
    case 'wallet/accountsRetrieved':
      return { ...state, [action.payload.chainId]: action.payload.accounts }
    default:
      return state
  }
}

const error = (
  state: ConnectionError | UnspecifiedError | null = null,
  action: ErrorWalletActionTypes
) => {
  switch (action.type) {
    case 'wallet/walletFailed':
      return action.payload.error
    default:
      return state
  }
}
const rootReducer = combineReducers({ connectionStatuses, accounts, error })

export default rootReducer
