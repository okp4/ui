export type SaveFilePayload<I> = {
  id: I
  name: string
  size: number
  type: string
  stream: ReadableStream
}
export type SaveFilesPayload<I> = SaveFilePayload<I>[]
