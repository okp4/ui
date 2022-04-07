/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Provider, createStoreHook, createDispatchHook, createSelectorHook } from 'react-redux'
import type { ReactReduxContextValue } from 'react-redux'
import { configureStore as configureFaucetStore } from 'domain/faucet/store/store'
import type { AppState as FaucetAppState } from 'domain/faucet/store/appState'
import type { AppState as WalletAppState } from 'domain/wallet/store/appState'
import { configureStore as configureWalletStore } from 'domain/wallet/store/store'
import { HTTPFaucetGateway } from '../../../gateway/faucet/HTTPFaucetGateway'
import { WalletRegistryGateway } from '../../../gateway/wallet/WalletRegistryGateway'
import { KeplrWallet } from '../../../gateway/wallet/KeplrWalletGateway'
import { Env } from './env'
import type { DeepReadonly } from '../../../superTypes'

// Faucet
const FaucetContext = React.createContext(null) as unknown as React.Context<
  ReactReduxContextValue<FaucetAppState, any>
>
export const useFaucetStore = createStoreHook(FaucetContext)
export const useFaucetDispatch = createDispatchHook(FaucetContext)
export const useFaucetSelector = createSelectorHook(FaucetContext)
const faucetGateway = new HTTPFaucetGateway('https://faucet.testnet.staging.okp4.network/')
const faucetStore = configureFaucetStore({ faucetGateway })

// Wallet
const WalletContext = React.createContext(null) as unknown as React.Context<
  ReactReduxContextValue<WalletAppState, any>
>
const walletRegistryGateway = new WalletRegistryGateway()
walletRegistryGateway.register(new KeplrWallet([Env.chainInfo]))
const walletStore = configureWalletStore({ walletRegistryGateway })
export const useWalletStore = createStoreHook(WalletContext)
export const useWalletDispatch = createDispatchHook(WalletContext)
export const useWalletSelector = createSelectorHook(WalletContext)

type FaucetProviderProps = DeepReadonly<{
  children: React.ReactNode
}>

export const FaucetProvider: React.FC<FaucetProviderProps> = ({
  children
}: FaucetProviderProps) => {
  return (
    <Provider context={FaucetContext} store={faucetStore}>
      <Provider context={WalletContext} store={walletStore}>
        {children}
      </Provider>
    </Provider>
  )
}
