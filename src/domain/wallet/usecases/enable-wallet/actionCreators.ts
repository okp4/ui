/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from '../../../helpers/store.helper'
import { createAction } from '../../../helpers/store.helper'
import type { Accounts, ChainId } from '../../entities/wallet'

export const EnableWalletActions = {
  walletConnected: (chaindId: ChainId) => createAction('wallet/walletConnected', { chaindId }),
  accountsRetrieved: (chainId: ChainId, accounts: Readonly<Accounts>) =>
    createAction('wallet/accountsRetrieved', { chainId, accounts })
}

export type EnableWalletActionTypes = ActionsUnion<typeof EnableWalletActions>
