import type { Action, Store } from 'redux'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import type { ThunkAction, ThunkDispatch, ThunkMiddleware } from 'redux-thunk'
import thunk from 'redux-thunk'
import type { EventBus } from 'ts-bus'
import type { AppState } from '../store/appState'
import rootReducer from './reducer/faucet.reducer'
import type { FaucetPort } from '../port/faucetPort'
import type { RequestFundsActionTypes } from '../usecase/request-funds/actionCreators'
import type { ErrorFaucetActionTypes } from '../usecase/actionCreators'
import { createEventBusMiddleware } from 'domain/helpers/store.helper'
import type { DeepReadonly } from 'superTypes'

export interface Dependencies {
  readonly faucetGateway: FaucetPort
}
export const configureStore = (
  dependencies: Partial<Dependencies>,
  eventBus: DeepReadonly<EventBus>
): Store<AppState> =>
  createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(
        thunk.withExtraArgument(dependencies) as ThunkMiddleware<AppState, Action, Dependencies>,
        createEventBusMiddleware<RequestFundsActionTypes | ErrorFaucetActionTypes>(eventBus)
      )
    )
  )

export type ReduxStore = Store<AppState> & {
  readonly dispatch: ThunkDispatch<AppState, Dependencies, Action>
}
export type ThunkResult<R> = ThunkAction<R, AppState, Dependencies, Action>
