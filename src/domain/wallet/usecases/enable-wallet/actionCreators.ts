/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ActionsUnion, createAction } from '../../store/store'
import { Accounts, ChainId } from '../../entities/wallet'

export const EnableWalletActions = {
  walletConnected: (chaindId: ChainId) =>
    createAction('wallet/walletConnected', { chaindId }),
  accountsRetrieved: (chainId: ChainId, accounts: Accounts) =>
    createAction('wallet/accountsRetrieved', { chainId, accounts }),
}

export type EnableWalletActionTypes = ActionsUnion<typeof EnableWalletActions>
