import { createStoreHook, createDispatchHook, createSelectorHook } from 'react-redux'
import { FaucetContext } from 'context/index'

export const useFaucetStore = createStoreHook(FaucetContext)
export const useFaucetDispatch = createDispatchHook(FaucetContext)
export const useFaucetSelector = createSelectorHook(FaucetContext)
