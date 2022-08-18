import type { ReduxStore, ThunkResult } from 'domain/file/store/store'
import type { SaveFilePayload, SaveFilesPayload } from 'domain/file/command/saveFiles'
import { SaveFilesActions } from './actionCreators'
import type { DeepReadonly } from 'superTypes'
import { FileMapper } from 'adapters/file/mapper/file.mapper'
import { ErrorMapper } from 'domain/error/mapper/error.mapper'
import { ThrowErrorActions } from 'domain/common/actionCreators'
import { UnspecifiedError } from 'domain/file/entity/error'

const dispatchError = (error: unknown, dispatch: ReduxStore['dispatch']): void => {
  const errorToDispatch = ErrorMapper.mapRawErrorToEntity(error)
  dispatch(ThrowErrorActions.errorThrown(errorToDispatch))
}

export const saveFiles =
  (files: DeepReadonly<SaveFilesPayload<string>>): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async (dispatch, getState) => {
    files.forEach((file: DeepReadonly<SaveFilePayload<string>>) => {
      if (getState().file.byId.has(file.id)) {
        dispatchError(
          new UnspecifiedError(
            `Oops.. The provided id '${file.id}' already exists, so we can't save this file..`
          ),
          dispatch
        )
        return
      }
      dispatch(SaveFilesActions.fileSaved(FileMapper.mapCommandPayloadToEntity(file)))
    })
  }
