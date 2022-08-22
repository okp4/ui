import { OrderedSet, OrderedMap } from 'immutable'
import { combineReducers } from 'redux'
import type { FileEntity } from 'domain/file/entity/file'
import type { FileState } from '../appState'
import type { DeepReadonly } from 'superTypes'
import type { StoreFilesActionTypes } from 'domain/file/usecase/store-files/actionCreators'
import type { RemoveFilesActionTypes } from 'domain/file/usecase/remove-files/actionCreators'
import type { RemoveFileActionTypes } from 'domain/file/usecase/remove-file/actionCreators'

const initialFileState: FileState<string> = {
  byId: OrderedMap<string, FileEntity>(),
  byType: OrderedMap<string, OrderedSet<string>>()
}

const file = (
  state: DeepReadonly<FileState> = initialFileState,
  action: DeepReadonly<StoreFilesActionTypes | RemoveFilesActionTypes | RemoveFileActionTypes>
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
    case 'file/fileRemoved': {
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
    case 'file/filesRemoved':
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
