/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'

export const RequestFundsActions = {
  requestFundsProceeded: () => createAction('faucet/requestFundsProceeded'),
  requestFundsSucceeded: () => createAction('faucet/requestFundsSucceeded')
}

export type RequestFundsActionTypes = ActionsUnion<typeof RequestFundsActions>
