/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from '../store/store'
import { createAction } from '../store/store'
import type { ConnectionError, UnspecifiedError } from 'domain/wallet/entities/errors'
import type { DeepReadonly } from '../../../superTypes'

export const ErrorWalletActions = {
  walletFailed: (error: DeepReadonly<ConnectionError> | DeepReadonly<UnspecifiedError>) =>
    createAction('wallet/walletFailed', { error })
}

export type ErrorWalletActionTypes = ActionsUnion<typeof ErrorWalletActions>
