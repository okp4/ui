/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ActionsUnion, createAction } from '../store/store'
import {
  ConnectionError,
  UnspecifiedError,
} from 'domain/wallet/entities/errors'

export const ErrorWalletActions = {
  walletFailed: (error: ConnectionError | UnspecifiedError) =>
    createAction('wallet/walletFailed', { error }),
}

export type ErrorWalletActionTypes = ActionsUnion<typeof ErrorWalletActions>
