import type { List } from 'immutable'
import React from 'react'
import type { ReactReduxContextValue } from 'react-redux'
import { Provider } from 'react-redux'
import type { Store } from 'redux'
import type { DeepReadonly } from 'superTypes'

export type StoreContext = React.Context<ReactReduxContextValue<unknown>>
export type StoreParameter = [StoreContext, Store<unknown>]

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
      [context, store]: [DeepReadonly<StoreContext>, DeepReadonly<Store<unknown>>]
    ) => {
      return (
        <Provider context={context} store={store}>
          {acc}
        </Provider>
      )
    },
    children
  )
