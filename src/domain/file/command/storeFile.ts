import type { MediaType } from 'domain/common/type'

export type StoreFilePayload<I = string> = {
  id: I
  name: string
  size: number
  type: MediaType
  stream: ReadableStream
}
export type StoreFilesPayload<I = string> = StoreFilePayload<I>[]
