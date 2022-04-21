import type { ErrorsById, Id } from '../entity/error'

export interface AppState {
  readonly errors: ErrorsById
  readonly unseenErrorId: Id
}
