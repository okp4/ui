import { uniqBy } from 'lodash'
import type { ReduxStore, ThunkResult } from 'domain/file/store/store'
import type { StoreFile, StoreFiles } from 'domain/file/command/storeFiles'
import { StoreFileActions } from '../../event/file-stored/actionCreators'
import type { DeepReadonly } from 'superTypes'
import { ErrorMapper } from 'domain/error/mapper/error.mapper'
import { ThrowErrorActions } from 'domain/common/actionCreators'
import { UnspecifiedError } from 'domain/file/entity/error'

const dispatchError = (error: unknown, dispatch: ReduxStore['dispatch']): void => {
  const errorToDispatch = ErrorMapper.mapRawErrorToEntity(error)
  dispatch(ThrowErrorActions.errorThrown(errorToDispatch))
}

export const storeFiles =
  (storeFilesPayload: DeepReadonly<StoreFiles>): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async (dispatch, getState) => {
    const hasDuplicatedIdInState = storeFilesPayload.some((file: DeepReadonly<StoreFile>) =>
      getState().file.byId.has(file.id)
    )
    const isCommandPayloadValid =
      uniqBy(storeFilesPayload, 'id').length === storeFilesPayload.length

    if (hasDuplicatedIdInState || !isCommandPayloadValid) {
      dispatchError(
        new UnspecifiedError(
          `You are trying either to store a file whose id already exists or to store files with the same id... So we can't store these files...`
        ),
        dispatch
      )
      return
    }

    storeFilesPayload.forEach((fileToStore: DeepReadonly<StoreFile>) => {
      const { id, name, size, stream, type }: StoreFile = fileToStore
      dispatch(StoreFileActions.fileStored({ id, name, size, stream, type }))
    })
  }
