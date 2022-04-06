import { combineReducers } from 'redux'
import type { AskTokensActionTypes } from '../../usecases/ask-tokens/actionCreators'
import type { DeepReadonly } from '../../../../superTypes'
import type { FaucetStatus } from '../appState'

const error = (
  state: DeepReadonly<Error> | null = null,
  action: DeepReadonly<AskTokensActionTypes>
): Error | null => {
  switch (action.type) {
    case 'faucet/faucetFailed':
      return action.payload.error
    default:
      return state
  }
}

const status = (
  state: FaucetStatus = 'idle',
  action: DeepReadonly<AskTokensActionTypes>
): FaucetStatus => {
  switch (action.type) {
    case 'faucet/faucetProceeded':
      return 'processing'
    case 'faucet/faucetFailed':
      return 'error'
    case 'faucet/faucetSucceed':
      return 'success'
    default:
      return state
  }
}

const rootReducer = combineReducers({ status, error })

export default rootReducer
