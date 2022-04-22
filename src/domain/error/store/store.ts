import type { Action, Store } from 'redux'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import type { ThunkAction, ThunkDispatch, ThunkMiddleware } from 'redux-thunk'
import thunk from 'redux-thunk'
import type { EventBus } from 'ts-bus'
import type { AppState } from './appState'
import rootReducer from './reducer/error.reducer'
import { eventBusMiddleware } from 'domain/helpers/store.helper'
import type { DeepReadonly } from 'superTypes'

export const configureStore = (
  eventBus: DeepReadonly<EventBus>,
  preloadedState?: DeepReadonly<AppState>
): Store<AppState> =>
  createStore(
    rootReducer,
    preloadedState,
    composeWithDevTools(
      applyMiddleware(thunk as ThunkMiddleware<AppState, Action>, eventBusMiddleware(eventBus))
    )
  )

export type ReduxStore = Store<AppState> & {
  readonly dispatch: ThunkDispatch<AppState, undefined, Action>
}
export type ThunkResult<R> = ThunkAction<R, AppState, undefined, Action>
