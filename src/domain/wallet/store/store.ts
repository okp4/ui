import type { Action, Store } from 'redux'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import type { ThunkAction, ThunkDispatch, ThunkMiddleware } from 'redux-thunk'
import thunk from 'redux-thunk'

import type { AppState } from '../store/appState'
import rootReducer from './reducers/wallet.reducer'
import type { WalletRegistryPort } from '../ports/walletPort'

export interface Dependencies {
  readonly walletRegistryGateway: WalletRegistryPort
}

export const configureStore = (dependencies: Partial<Dependencies>): Store<AppState> =>
  createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(
        thunk.withExtraArgument(dependencies) as ThunkMiddleware<AppState, Action, Dependencies>
      )
    )
  )

export type ReduxStore = Store<AppState> & {
  readonly dispatch: ThunkDispatch<AppState, Dependencies, Action>
}
export type ThunkResult<R> = ThunkAction<R, AppState, Dependencies, Action>

export interface ActionWithPayload<T extends string, P> extends Action<T> {
  readonly payload: P
}

export function createAction<T extends string>(type: T): Action<T>
export function createAction<T extends string, P>(type: T, payload?: P): ActionWithPayload<T, P>

export function createAction<T extends string, P>(
  type: T,
  payload?: P
): Action<T> | ActionWithPayload<T, P> {
  return payload === undefined ? { type } : { type, payload }
}

type FunctionType = (...args: readonly never[]) => unknown
type ActionCreatorsMapObject = Record<string, FunctionType>

export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<A[keyof A]>
