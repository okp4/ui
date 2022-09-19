import { OrderedSet, OrderedMap } from 'immutable'
import { combineReducers } from 'redux'
import type { FileEntity } from 'domain/file/entity/file'
import type { FileState } from '../appState'
import type { DeepReadonly } from 'superTypes'
import type { StoreFileActionTypes } from 'domain/file/event/file-stored/actionCreators'
import type { RemoveFileActionTypes } from 'domain/file/event/file-removed/actionCreators'
import type { FileStoredPayload } from 'domain/file/event/file-stored/fileStored'
import type { FileRemovedPayload } from 'domain/file/event/file-removed/fileRemoved'

const initialFileState: FileState<string> = {
  byId: OrderedMap<string, FileEntity>(),
  byType: OrderedMap<string, OrderedSet<string>>()
}

const file = (
  state: DeepReadonly<FileState> = initialFileState,
  action: DeepReadonly<StoreFileActionTypes | RemoveFileActionTypes>
): FileState => {
  switch (action.type) {
    case 'file/fileStored': {
      const { id, type }: FileStoredPayload = action.payload
      const foundList = state.byType.get(type)
      return {
        ...state,
        byId: state.byId.set(id, action.payload),
        byType: state.byType.set(type, foundList?.size ? foundList.add(id) : OrderedSet([id]))
      }
    }
    case 'file/fileRemoved': {
      const { id }: FileRemovedPayload = action.payload
      const foundFileById = state.byId.get(id)
      return {
        ...state,
        ...(foundFileById && {
          byId: state.byId.remove(id)
        }),
        byType: state.byType
          .map((value: Readonly<OrderedSet<string>>) => value.delete(id))
          .filter((value: Readonly<OrderedSet<string>>) => !value.isEmpty())
      }
    }
    default:
      return state
  }
}

const rootReducer = combineReducers({ file })

export default rootReducer
