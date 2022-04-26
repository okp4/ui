import { combineReducers } from 'redux'
import type { RequestFundsActionTypes } from '../../usecase/request-funds/actionCreators'
import type { SetAddressActionTypes } from '../../usecase/set-address/actionCreators'
import type { DeepReadonly } from '../../../../superTypes'

const address = (state: string = '', action: DeepReadonly<SetAddressActionTypes>): string => {
  switch (action.type) {
    case 'faucet/addressSet':
      return action.payload.address
    default:
      return state
  }
}

const isProcessing = (
  state: boolean = false,
  action: DeepReadonly<RequestFundsActionTypes>
): boolean => {
  switch (action.type) {
    case 'faucet/requestFundsProceeded':
      return true
    case 'faucet/requestFundsSucceeded':
      return false
    default:
      return state
  }
}

const rootReducer = combineReducers({ address, isProcessing })

export default rootReducer
