import { List } from 'immutable'
import { FileStoreBuilder } from 'domain/file/store/builder/store.builder'
import { FileContext } from 'context/storeContext/fileContext'
import { createEventBusInstance } from 'eventBus/index'
import type { StoreParameter } from 'ui/providers/storeProvider'
import 'domain/error/index'

const eventBusInstance = createEventBusInstance()

// File
const fileStore = new FileStoreBuilder().withEventBus(eventBusInstance).build()
const fileStoreParameter: StoreParameter = [FileContext, fileStore]

export default List([fileStoreParameter])
