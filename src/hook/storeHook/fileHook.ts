import { createStoreHook, createDispatchHook, createSelectorHook } from 'react-redux'
import { FileContext } from 'context/index'

export const useFileStore = createStoreHook(FileContext)
export const useFileDispatch = createDispatchHook(FileContext)
export const useFileSelector = createSelectorHook(FileContext)
