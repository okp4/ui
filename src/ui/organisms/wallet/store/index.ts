import { createStoreHook, createDispatchHook, createSelectorHook } from 'react-redux'
import type { AnyAction, Store } from 'redux'
import { WalletContext } from '../context/index'
import { configureStore as configureWalletStore } from 'domain/wallet/store/store'
import type { AppState as WalletAppState } from 'domain/wallet/store/appState'
import type { ChainInfo } from 'adapters/secondary/wallet/KeplrWalletGateway'
import { KeplrWalletGateway } from 'adapters/secondary/wallet/KeplrWalletGateway'
import { WalletRegistryGateway } from 'adapters/secondary/wallet/WalletRegistryGateway'
import type { DeepReadonly } from 'superTypes'

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
