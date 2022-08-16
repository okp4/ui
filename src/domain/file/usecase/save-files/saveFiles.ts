import type { ThunkResult } from 'domain/file/store/store'
import type { SaveFilePayload, SaveFilesPayload } from 'domain/file/command/saveFiles'
import { SaveFilesActions } from './actionCreators'
import type { FileEntity } from 'domain/file/entity/file'
import type { DeepReadonly } from 'superTypes'

export const saveFiles =
  (files: DeepReadonly<SaveFilesPayload<string>>): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async dispatch => {
    files.forEach((file: DeepReadonly<SaveFilePayload<string>>) => {
      const f: FileEntity = {
        id: file.id,
        name: file.name,
        size: file.size,
        type: file.type,
        stream: file.stream
      }
      dispatch(SaveFilesActions.fileSaved(f))
    })
  }
