import { createStoreHook, createDispatchHook, createSelectorHook } from 'react-redux'
import { WalletContext } from 'context/index'

export const useWalletStore = createStoreHook(WalletContext)
export const useWalletDispatch = createDispatchHook(WalletContext)
export const useWalletSelector = createSelectorHook(WalletContext)
