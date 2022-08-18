export type SaveFilePayload<I = string> = {
  id: I
  name: string
  size: number
  type: string
  stream: ReadableStream
}
export type SaveFilesPayload<I = string> = SaveFilePayload<I>[]
