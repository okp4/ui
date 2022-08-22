import type { Entity } from 'domain/common/type'

export type FileEntity<I = string> = Entity<
  {
    readonly name: string
    readonly size: number
    readonly type: string
    readonly stream: ReadableStream
  },
  I
>
