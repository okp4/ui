/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'
import type { Accounts, ChainId } from 'domain/wallet/entities/wallet'

export const EnableWalletActions = {
  walletConnected: (chaindId: ChainId) => createAction('wallet/walletConnected', { chaindId }),
  accountsRetrieved: (chainId: ChainId, accounts: Readonly<Accounts>) =>
    createAction('wallet/accountsRetrieved', { chainId, accounts })
}

export type EnableWalletActionTypes = ActionsUnion<typeof EnableWalletActions>
