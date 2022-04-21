import type { ErrorsById } from '../entity/error'

export interface AppState {
  readonly errors: ErrorsById
  readonly hasErrorUnseen: boolean
}
