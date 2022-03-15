import { ActionsUnion, createAction } from '../store/store'
import { ConnectionError } from 'domain/wallet/entities/errors'

export const ErrorWalletActions = {
  walletFailed: (error: ConnectionError) =>
    createAction('wallet/walletFailed', { error }),
}

export type ErrorWalletActionTypes = ActionsUnion<typeof ErrorWalletActions>
