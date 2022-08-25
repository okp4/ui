import { List } from 'immutable'
import { FileStoreBuilder } from 'domain/file/store/builder/store.builder'
import { ErrorStoreBuilder } from 'domain/error/store/builder/store.builder'
import { TaskStoreBuilder } from 'domain/task/store/builder/store.builder'
import { FileContext } from 'context/storeContext/fileContext'
import { TaskContext } from 'context/storeContext/taskContext'
import { ErrorContext } from 'context/storeContext/errorContext'
import { createEventBusInstance } from 'eventBus/index'
import type { StoreParameter } from 'ui/providers/storeProvider'
import 'domain/error/index'

const eventBusInstance = createEventBusInstance()

// File
const fileStore = new FileStoreBuilder().withEventBus(eventBusInstance).build()
const fileStoreParameter: StoreParameter = [FileContext, fileStore]

// Error
const errorStore = new ErrorStoreBuilder().withEventBus(eventBusInstance).build()
const errorStoreParameter: StoreParameter = [ErrorContext, errorStore]

// Task
const taskStore = new TaskStoreBuilder().withEventBus(eventBusInstance).build()
const taskStoreParameter: StoreParameter = [TaskContext, taskStore]

export default List([fileStoreParameter, errorStoreParameter, taskStoreParameter])
