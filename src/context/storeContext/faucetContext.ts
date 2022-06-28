import React from 'react'
import type { ReactReduxContextValue } from 'react-redux'
import type { AppState } from 'domain/faucet/store/appState'

export const FaucetContext = React.createContext(null) as unknown as React.Context<
  ReactReduxContextValue<AppState>
>
