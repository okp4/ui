import { createSelector } from 'reselect'
import type { AppState } from '../appState'
import type { Error, ErrorsById, Id } from '../../entity/error'
import type { DeepReadonly } from 'superTypes'

export const getErrorById: (state: DeepReadonly<AppState>, id: Id) => Error | undefined =
  createSelector(
    [
      (state: DeepReadonly<AppState>): ErrorsById => state.errors,
      (state: DeepReadonly<AppState>, id: Id): Id => id
    ],
    (errors: DeepReadonly<ErrorsById>, id: Id) => errors.get(id)
  )

export const hasUnseenError: (state: DeepReadonly<AppState>) => boolean = createSelector(
  (state: DeepReadonly<AppState>): Id => state.unseenErrorId,
  (id: Id) => !!id
)

export const unseenErrorMessage: (state: DeepReadonly<AppState>) => string | undefined =
  createSelector(
    (state: DeepReadonly<AppState>): AppState => state,
    (state: DeepReadonly<AppState>) => getErrorById(state, state.unseenErrorId)?.message
  )
