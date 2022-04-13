import { combineReducers } from 'redux'
import type { RequestFundsActionTypes } from '../../usecase/request-funds/actionCreators'
import type { SetAddressActionTypes } from '../../usecase/set-address/actionCreators'
import type { DeepReadonly } from '../../../../superTypes'
import type { FaucetStatus } from '../appState'
import type { ErrorFaucetActionTypes } from 'domain/faucet/usecase/actionCreators'

const address = (state: string = '', action: DeepReadonly<SetAddressActionTypes>): string => {
  switch (action.type) {
    case 'faucet/addressSet':
      return action.payload.address
    default:
      return state
  }
}

const error = (
  state: DeepReadonly<Error> | null = null,
  action: DeepReadonly<ErrorFaucetActionTypes> | DeepReadonly<RequestFundsActionTypes>
): Error | null => {
  switch (action.type) {
    case 'faucet/faucetFailed':
      return action.payload.error
    case 'faucet/RequestFundsFailed':
      return action.payload.error
    default:
      return state
  }
}

const status = (
  state: FaucetStatus = 'idle',
  action: DeepReadonly<RequestFundsActionTypes>
): FaucetStatus => {
  switch (action.type) {
    case 'faucet/requestFundsProceeded':
      return 'processing'
    case 'faucet/RequestFundsFailed':
      return 'error'
    case 'faucet/requestFundsSucceeded':
      return 'success'
    default:
      return state
  }
}

const rootReducer = combineReducers({ address, status, error })

export default rootReducer
