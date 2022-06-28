import React from 'react'
import type { ReactReduxContextValue } from 'react-redux'
import type { AppState } from 'domain/wallet/store/appState'

export const WalletContext = React.createContext(null) as unknown as React.Context<
  ReactReduxContextValue<AppState>
>
