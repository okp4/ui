import type { Entity, MediaType } from 'domain/common/type'

export type FileEntity<I = string> = Entity<
  {
    readonly name: string
    readonly size: number
    readonly type: MediaType
    readonly stream: ReadableStream
  },
  I
>
