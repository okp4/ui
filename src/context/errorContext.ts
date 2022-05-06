/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import type { ReactReduxContextValue } from 'react-redux'
import type { AppState as ErrorAppState } from 'domain/error/store/appState'

export const ErrorContext = React.createContext(null) as unknown as React.Context<
  ReactReduxContextValue<ErrorAppState, any>
>
