/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from '../../../helpers/store.helper'
import { createAction } from '../../../helpers/store.helper'
import type { ValidationError, GatewayError } from 'domain/faucet/entities/error'
import type { DeepReadonly } from '../../../../superTypes'

export const AskTokensActions = {
  faucetProceeded: () => createAction('faucet/faucetProceeded'),
  faucetFailed: (error: DeepReadonly<GatewayError> | DeepReadonly<ValidationError>) =>
    createAction('faucet/faucetFailed', { error }),
  faucetSucceed: () => createAction('faucet/faucetSucceed')
}

export type AskTokensActionTypes = ActionsUnion<typeof AskTokensActions>
