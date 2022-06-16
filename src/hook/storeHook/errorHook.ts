import { createStoreHook, createDispatchHook, createSelectorHook } from 'react-redux'
import { ErrorContext } from 'context/index'

export const useErrorStore = createStoreHook(ErrorContext)
export const useErrorDispatch = createDispatchHook(ErrorContext)
export const useErrorSelector = createSelectorHook(ErrorContext)
