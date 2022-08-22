import { OrderedSet, OrderedMap } from 'immutable'
import { combineReducers } from 'redux'
import type { FileEntity } from 'domain/file/entity/file'
import type { FileState } from '../appState'
import type { DeepReadonly } from 'superTypes'
import type { StoreFilesActionTypes } from 'domain/file/usecase/store-files/actionCreators'
import type { ClearFilesActionTypes } from 'domain/file/usecase/clear-files/actionCreators'
import type { ClearFileActionTypes } from 'domain/file/usecase/clear-file/actionCreators'

const initialFileState: FileState<string> = {
  byId: OrderedMap<string, FileEntity>(),
  byType: OrderedMap<string, OrderedSet<string>>()
}

const file = (
  state: DeepReadonly<FileState> = initialFileState,
  action: DeepReadonly<StoreFilesActionTypes | ClearFilesActionTypes | ClearFileActionTypes>
): FileState => {
  switch (action.type) {
    case 'file/fileStored': {
      const { id, type }: FileEntity = action.payload
      const foundList = state.byType.get(type)
      return {
        ...state,
        byId: state.byId.set(id, action.payload),
        byType: state.byType.set(type, foundList?.size ? foundList.add(id) : OrderedSet([id]))
      }
    }
    case 'file/fileCleared': {
      const foundFileById = state.byId.get(action.payload)
      return {
        ...state,
        ...(foundFileById && {
          byId: state.byId.remove(action.payload)
        }),
        byType: state.byType
          .map((value: Readonly<OrderedSet<string>>) => value.delete(action.payload))
          .filter((value: Readonly<OrderedSet<string>>) => !value.isEmpty())
      }
    }
    case 'file/filesCleared':
      return {
        ...state,
        byId: state.byId.clear(),
        byType: state.byType.clear()
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({ file })

export default rootReducer
