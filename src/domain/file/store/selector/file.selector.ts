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

export const getFilesSizeByIds: (state: DeepReadonly<AppState>, ids: Readonly<string[]>) => number =
  createSelector(
    [
      (state: DeepReadonly<AppState>): FileById => state.file.byId,
      (_state: DeepReadonly<AppState>, ids: Readonly<string[]>): Readonly<string[]> => ids
    ],
    (files: DeepReadonly<FileById>, ids: Readonly<string[]>): number =>
      ids.reduce((acc: number, cur: string) => {
        const found = files.get(cur)
        return found ? acc + found.size : acc
      }, 0)
  )

export const getTotalFilesSize: (state: DeepReadonly<AppState>) => number = createSelector(
  (state: DeepReadonly<AppState>): AppState => state,
  (state: DeepReadonly<AppState>): number =>
    getFilesSizeByIds(
      state,
      state.file.byId
        .toIndexedSeq()
        .toArray()
        .map((value: FileEntity) => value.id)
    )
)
