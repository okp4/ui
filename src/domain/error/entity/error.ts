import type { Map } from 'immutable'
import type { Entity } from 'domain/type/entity.type'

export type Id = string
export type Error = Entity<
  {
    readonly messageKey: string
    readonly timestamp: Date
    readonly type: string
    readonly context?: Record<string, unknown>
  },
  Id
>

export type ErrorsById = Map<Id, Error>

export class UnspecifiedError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'UnspecifiedError'
  }
}
