import React from 'react'
import type { ReactReduxContextValue } from 'react-redux'
import type { AppState as FaucetAppState } from 'domain/faucet/store/appState'

export const FaucetContext = React.createContext(null) as unknown as React.Context<
  ReactReduxContextValue<FaucetAppState>
>
