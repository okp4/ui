import { OrderedSet, OrderedMap } from 'immutable'
import { combineReducers } from 'redux'
import type { FileEntity } from 'domain/file/entity/file'
import type { FileState } from '../appState'
import type { DeepReadonly } from 'superTypes'
import type { SaveFilesActionTypes } from 'domain/file/usecase/save-files/actionCreators'

const initialFileState: FileState<string> = {
  byId: OrderedMap<string, FileEntity>(),
  byType: OrderedMap<string, OrderedSet<string>>()
}

const file = (
  state: DeepReadonly<FileState> = initialFileState,
  action: DeepReadonly<SaveFilesActionTypes>
): FileState => {
  switch (action.type) {
    case 'file/fileSaved': {
      const { id, type }: FileEntity = action.payload
      const foundList = state.byType.get(type)
      return {
        ...state,
        byId: state.byId.set(id, action.payload),
        byType: state.byType.set(type, foundList?.size ? foundList.add(id) : OrderedSet([id]))
      }
    }
    default:
      return state
  }
}

const rootReducer = combineReducers({ file })

export default rootReducer
