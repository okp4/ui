import type { OrderedSet, OrderedMap } from 'immutable'
import type { FileEntity } from '../entity/file'

export type AppState<I = string> = {
  readonly file: FileState<I>
}

export type FileState<I = string> = {
  readonly byId: FileById<I>
  readonly byType: FileByType<I>
}

export type FileById<I = string> = OrderedMap<I, FileEntity>
export type FileByType<I = string> = OrderedMap<string, OrderedSet<I>>
