import type { DeepReadonly } from 'superTypes'
import type { MediaType } from 'domain/common/type'

export type FilePortId = string

export type FileToUpload = {
  id: string
  name: string
  stream: ReadableStream
  size: number
  type: MediaType
}

export type UploadFile = (
  file: DeepReadonly<FileToUpload>,
  target: string, // the root folder / bucket / etc. in which the file must be uploaded on server.
  onProgressChange?: FileProgressHandler
) => Promise<void>

export type FileRegistryPort = {
  readonly get: (id: FilePortId) => FilePort
  readonly names: () => readonly string[]
}

export type FilePort = {
  readonly id: () => FilePortId
  readonly execute: (handler: FileExecutor) => Promise<void>
}

export type FileExecutorHandler = {
  upload: UploadFile
}
export type FileExecutor = (handler: DeepReadonly<FileExecutorHandler>) => void

export type FileProgressHandler = (value?: number) => void
