import type { List } from 'immutable'
import React from 'react'
import type { ReactReduxContextValue } from 'react-redux'
import { Provider } from 'react-redux'
import type { Store } from 'redux'
import type { DeepReadonly } from 'superTypes'

// Need any type for Action to allow Redux to dispatch async Thunks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StoreContext = React.Context<ReactReduxContextValue<any>>
// Need any type for Store, if not, type breaks in the props type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StoreParameter = [StoreContext, Store<any>]

export type StoreProviderProps = DeepReadonly<{
  storeParameters: List<StoreParameter>
  children: React.ReactElement
}>

export const StoreProvider: React.FC<StoreProviderProps> = ({
  storeParameters,
  children
}: StoreProviderProps): JSX.Element =>
  storeParameters.reduceRight(
    (
      acc: DeepReadonly<React.ReactElement>,
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      [context, store]: StoreParameter
    ) => {
      return (
        <Provider context={context} store={store}>
          {acc}
        </Provider>
      )
    },
    children
  )
