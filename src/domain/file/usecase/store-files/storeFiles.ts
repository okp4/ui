import type { ReduxStore, ThunkResult } from 'domain/file/store/store'
import type { StoreFilePayload, StoreFilesPayload } from 'domain/file/command/storeFile'
import { StoreFilesActions } from './actionCreators'
import type { DeepReadonly } from 'superTypes'
import { FileMapper } from 'adapters/file/mapper/file.mapper'
import { ErrorMapper } from 'domain/error/mapper/error.mapper'
import { ThrowErrorActions } from 'domain/common/actionCreators'
import { UnspecifiedError } from 'domain/file/entity/error'

const dispatchError = (error: unknown, dispatch: ReduxStore['dispatch']): void => {
  const errorToDispatch = ErrorMapper.mapRawErrorToEntity(error)
  dispatch(ThrowErrorActions.errorThrown(errorToDispatch))
}

export const storeFiles =
  (files: DeepReadonly<StoreFilesPayload<string>>): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async (dispatch, getState) => {
    const foundDuplicatedIdInState = files.some((file: DeepReadonly<StoreFilePayload<string>>) =>
      getState().file.byId.has(file.id)
    )
    const isCommandPayloadValid =
      [...new Set(files.map((file: DeepReadonly<StoreFilePayload<string>>) => file.id))].length ===
      files.length

    if (foundDuplicatedIdInState || !isCommandPayloadValid) {
      dispatchError(
        new UnspecifiedError(
          `You are trying either to store a file whose id already exists or to store files with the same id... So we can't perform a storeFiles command..`
        ),
        dispatch
      )
      return
    }

    files.forEach((file: DeepReadonly<StoreFilePayload<string>>) => {
      dispatch(StoreFilesActions.fileStored(FileMapper.mapCommandPayloadToEntity(file)))
    })
  }
