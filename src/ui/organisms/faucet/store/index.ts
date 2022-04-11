import { createStoreHook, createDispatchHook, createSelectorHook } from 'react-redux'
import type { AnyAction, Store } from 'redux'
import { FaucetContext } from '../context/index'
import { configureStore as configureFaucetStore } from 'domain/faucet/store/store'
import type { AppState as FaucetAppState } from 'domain/faucet/store/appState'
import { HTTPFaucetGateway } from 'adapters/secondary/faucet/HTTPFaucetGateway'

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
