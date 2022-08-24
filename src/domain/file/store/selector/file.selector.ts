import { createSelector } from 'reselect'
import type { DeepReadonly } from 'superTypes'
import type { AppState, FileById } from '../appState'
import type { MediaType } from 'domain/common/type'
import type { FileEntity } from 'domain/file/entity/file'

export type FileDescriptor = {
  readonly id: string
  readonly name: string
  readonly size: number
  readonly type: MediaType
}

export const getFiles: (state: DeepReadonly<AppState>) => FileDescriptor[] = createSelector(
  (state: DeepReadonly<AppState>): FileById => state.file.byId,
  (files: DeepReadonly<FileById>): FileDescriptor[] =>
    files
      .toIndexedSeq()
      .toArray()
      .map(({ id, name, size, type }: FileEntity) => ({ id, name, size, type }))
)
