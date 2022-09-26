import type { Action, Store } from 'redux'
import { applyMiddleware, legacy_createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import type { ThunkAction, ThunkDispatch, ThunkMiddleware } from 'redux-thunk'
import thunk from 'redux-thunk'
import type { EventBus } from 'ts-bus'
import type { AppState } from './appState'
import rootReducer from './reducer/file.reducer'
import { eventBusMiddleware } from 'domain/common/store.helper'
import type { DeepReadonly } from 'superTypes'
import type { FileRegistryPort } from '../port/filePort'

export interface Dependencies {
  readonly fileRegistryGateway: FileRegistryPort
}

export const configureStore = (
  dependencies: Partial<Dependencies>,
  eventBus: DeepReadonly<EventBus>,
  preloadedState?: DeepReadonly<AppState>
): Store<AppState> =>
  legacy_createStore(
    rootReducer,
    preloadedState,
    composeWithDevTools(
      applyMiddleware(
        thunk.withExtraArgument(dependencies) as ThunkMiddleware<AppState, Action, Dependencies>,
        eventBusMiddleware(eventBus, 'domain:file')
      )
    )
  )

export type ReduxStore = Store<AppState> & {
  readonly dispatch: ThunkDispatch<AppState, Dependencies, Action>
}
export type ThunkResult<R> = ThunkAction<R, AppState, Dependencies, Action>
