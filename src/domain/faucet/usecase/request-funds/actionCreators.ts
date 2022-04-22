/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'
import type { ValidationError, GatewayError } from 'domain/faucet/entity/error'
import type { DeepReadonly } from 'superTypes'

export const RequestFundsActions = {
  requestFundsProceeded: () => createAction('faucet/requestFundsProceeded'),
  requestFundsFailed: (error: DeepReadonly<GatewayError> | DeepReadonly<ValidationError>) =>
    createAction('faucet/RequestFundsFailed', { error }),
  requestFundsSucceeded: () => createAction('faucet/requestFundsSucceeded')
}

export type RequestFundsActionTypes = ActionsUnion<typeof RequestFundsActions>
