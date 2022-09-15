import type { MediaType } from 'domain/common/type'

export type StoreFile<I = string> = {
  id: I
  name: string
  size: number
  type: MediaType
  stream: ReadableStream
}
export type StoreFiles<I = string> = StoreFile<I>[]
