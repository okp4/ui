import React from 'react'
import type { ReactReduxContextValue } from 'react-redux'
import type { AppState } from 'domain/error/store/appState'

export const ErrorContext = React.createContext(null) as unknown as React.Context<
  // Need any type for Action to allow Redux to dispatch async Thunks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ReactReduxContextValue<AppState, any>
>
