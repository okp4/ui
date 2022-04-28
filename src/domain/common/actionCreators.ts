/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { Error } from 'domain/error/entity/error'
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'
import type { DeepReadonly } from 'superTypes'

export const ThrowErrorActions = {
  errorThrown: (error: Error) => createAction('error/errorThrown', error)
}

export type ThrowErrorActionTypes = ActionsUnion<typeof ThrowErrorActions>
export type ErrorThrownEvent = DeepReadonly<ReturnType<typeof ThrowErrorActions['errorThrown']>>
