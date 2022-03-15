import { combineReducers } from 'redux'
import { ConnectionError } from 'domain/wallet/entities/errors'
import { ConnectionStatuses } from 'domain/wallet/entities/wallet'
import { EnableWalletActionTypes } from '../../usecases/enable-wallet/actionCreators'
import { ErrorWalletActionTypes } from '../../usecases/actionCreators'

const connectedStatuses = (
  state: ConnectionStatuses = {},
  action: EnableWalletActionTypes
) => {
  switch (action.type) {
    case 'wallet/walletEnabled':
      return { ...state, [action.payload.chaindId]: 'connected' }
    default:
      return state
  }
}

const error = (
  state: ConnectionError | null = null,
  action: ErrorWalletActionTypes
) => {
  switch (action.type) {
    case 'wallet/walletFailed':
      return action.payload.error
    default:
      return state
  }
}

const rootReducer = combineReducers({ connectedStatuses, error })

export default rootReducer
