export type StoreFilePayload<I = string> = {
  id: I
  name: string
  size: number
  type: string
  stream: ReadableStream
}
export type StoreFilesPayload<I = string> = StoreFilePayload<I>[]
