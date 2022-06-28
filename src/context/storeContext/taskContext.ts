import React from 'react'
import type { ReactReduxContextValue } from 'react-redux'
import type { AppState } from 'domain/task/store/appState'

export const TaskContext = React.createContext(null) as unknown as React.Context<
  ReactReduxContextValue<AppState>
>
