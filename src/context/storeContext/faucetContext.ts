import { createContext } from 'react'
import type { ReactReduxContextValue } from 'react-redux'
import type { AppState } from 'domain/faucet/store/appState'
import type { Context } from 'react'

export const FaucetContext = createContext(null) as unknown as Context<
  // Need any type for Action to allow Redux to dispatch async Thunks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ReactReduxContextValue<AppState, any>
>
