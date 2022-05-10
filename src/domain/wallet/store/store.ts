import type { Action, Store } from 'redux'
import { applyMiddleware, legacy_createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import type { ThunkAction, ThunkDispatch, ThunkMiddleware } from 'redux-thunk'
import thunk from 'redux-thunk'
import type { EventBus } from 'ts-bus'
import type { AppState } from '../store/appState'
import rootReducer from './reducers/wallet.reducer'
import type { WalletRegistryPort } from '../ports/walletPort'
import { eventBusMiddleware } from 'domain/common/store.helper'
import type { DeepReadonly } from 'superTypes'

export interface Dependencies {
  readonly walletRegistryGateway: WalletRegistryPort
}

export const configureStore = (
  dependencies: Partial<Dependencies>,
  eventBus: DeepReadonly<EventBus>
): Store<AppState> =>
  legacy_createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(
        thunk.withExtraArgument(dependencies) as ThunkMiddleware<AppState, Action, Dependencies>,
        eventBusMiddleware(eventBus, 'domain:wallet')
      )
    )
  )

export type ReduxStore = Store<AppState> & {
  readonly dispatch: ThunkDispatch<AppState, Dependencies, Action>
}
export type ThunkResult<R> = ThunkAction<R, AppState, Dependencies, Action>
