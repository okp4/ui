/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { Id } from 'domain/error/entity/error'
import type { ActionsUnion } from 'domain/helpers/store.helper'
import { createAction } from 'domain/helpers/store.helper'

export const ClearErrorActions = {
  errorCleared: (id: Id) => createAction('error/errorCleared', { id })
}

export type ClearErrorActionTypes = ActionsUnion<typeof ClearErrorActions>
