import { ThrowErrorActions } from 'domain/common/actionCreators'
import { UnspecifiedError } from 'domain/file/entity/error'
import { ErrorMapper } from 'domain/error/mapper/error.mapper'
import type { RemoveFile } from 'domain/file/command/removeFile'
import type { ReduxStore, ThunkResult } from 'domain/file/store/store'
import type { DeepReadonly } from 'superTypes'
import { RemoveFileActions } from '../../event/file-removed/actionCreators'

const dispatchError = (error: unknown, dispatch: ReduxStore['dispatch']): void => {
  const errorToDispatch = ErrorMapper.mapRawErrorToEntity(error)
  dispatch(ThrowErrorActions.errorThrown(errorToDispatch))
}

export const removeFile =
  (removeFilePayload: DeepReadonly<RemoveFile>): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async (dispatch, getState) => {
    const { id }: RemoveFile = removeFilePayload

    if (!getState().file.byId.has(id)) {
      dispatchError(
        new UnspecifiedError(
          `The provided id '${id}' does not exist... So we can't remove this file...`
        ),
        dispatch
      )
      return
    }

    dispatch(RemoveFileActions.fileRemoved({ id }))
  }
