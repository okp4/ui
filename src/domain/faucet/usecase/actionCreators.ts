/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { DeepReadonly } from 'superTypes'
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'

export const ErrorFaucetActions = {
  faucetFailed: (error: DeepReadonly<Error>) => createAction('faucet/faucetFailed', { error })
}

export type ErrorFaucetActionTypes = ActionsUnion<typeof ErrorFaucetActions>
