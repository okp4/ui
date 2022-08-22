import type { FileEntity } from 'domain/file/entity/file'
import type { ThunkResult } from 'domain/file/store/store'
import { RemoveFileActions } from '../remove-file/actionCreators'

export const removeAllFiles =
  (): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async (dispatch, getState) => {
    getState().file.byId.forEach((_value: FileEntity, key: string) =>
      dispatch(RemoveFileActions.fileRemoved(key))
    )
  }
