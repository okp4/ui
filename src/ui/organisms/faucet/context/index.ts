/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import type { ReactReduxContextValue } from 'react-redux'
import type { AppState as FaucetAppState } from 'domain/faucet/store/appState'
import type { AppState as WalletAppState } from 'domain/wallet/store/appState'

export const FaucetContext = React.createContext(null) as unknown as React.Context<
  ReactReduxContextValue<FaucetAppState, any>
>

export const WalletContext = React.createContext(null) as unknown as React.Context<
  ReactReduxContextValue<WalletAppState, any>
>
