import { combineReducers } from 'redux'
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

const rootReducer = combineReducers({ address })

export default rootReducer
