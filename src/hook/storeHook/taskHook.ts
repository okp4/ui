import { createStoreHook, createDispatchHook, createSelectorHook } from 'react-redux'
import { TaskContext } from 'context/index'

export const useTaskStore = createStoreHook(TaskContext)
export const useTaskDispatch = createDispatchHook(TaskContext)
export const useTaskSelector = createSelectorHook(TaskContext)
