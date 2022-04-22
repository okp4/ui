import type { Map } from 'immutable'
import type { Entity } from 'domain/type/entity.type'

export type Id = string
export type Error = Entity<
  {
    readonly name: string
    readonly message: string
    readonly timestamp: Date
    readonly type: string
  },
  Id
>

export type ErrorsById = Map<Id, Error>
