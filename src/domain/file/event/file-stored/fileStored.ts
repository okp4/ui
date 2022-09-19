import type { MediaType } from 'domain/common/type'

export type FileStoredPayload<I = string> = {
  id: I
  name: string
  size: number
  type: MediaType
  stream: ReadableStream
}
