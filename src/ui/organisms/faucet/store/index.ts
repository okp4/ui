import { createStoreHook, createDispatchHook, createSelectorHook } from 'react-redux'
import type { AnyAction, Store } from 'redux'
import { FaucetContext, WalletContext } from '../context/index'
import { configureStore as configureFaucetStore } from 'domain/faucet/store/store'
import type { AppState as FaucetAppState } from 'domain/faucet/store/appState'
import { configureStore as configureWalletStore } from 'domain/wallet/store/store'
import type { AppState as WalletAppState } from 'domain/wallet/store/appState'
import { HTTPFaucetGateway } from 'gateway/faucet/HTTPFaucetGateway'
import type { ChainInfo } from 'gateway/wallet/KeplrWalletGateway'
import { KeplrWalletGateway } from 'gateway/wallet/KeplrWalletGateway'
import { WalletRegistryGateway } from 'gateway/wallet/WalletRegistryGateway'
import type { DeepReadonly } from 'superTypes'

/**
 * Faucet store initialization, create custom hooks to avoid collision
 */

export const useFaucetStore = createStoreHook(FaucetContext)
export const useFaucetDispatch = createDispatchHook(FaucetContext)
export const useFaucetSelector = createSelectorHook(FaucetContext)

export const createFaucetStore = (faucetUrl: string): Store<FaucetAppState, AnyAction> => {
  const faucetGateway = new HTTPFaucetGateway(faucetUrl)
  return configureFaucetStore({ faucetGateway })
}

/**
 * Wallet store initialization, create custom hooks to avoid collision
 */

export const useWalletStore = createStoreHook(WalletContext)
export const useWalletDispatch = createDispatchHook(WalletContext)
export const useWalletSelector = createSelectorHook(WalletContext)

export const createWalletStore = (
  chainInfo: DeepReadonly<Array<ChainInfo>>
): Store<WalletAppState, AnyAction> => {
  const walletRegistryGateway = new WalletRegistryGateway()
  const keplrGateway = new KeplrWalletGateway(chainInfo)
  walletRegistryGateway.register(keplrGateway)
  return configureWalletStore({ walletRegistryGateway })
}
