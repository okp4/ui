import { ActionsUnion, createAction } from '../../store/store'
import { ChainId } from '../../entities/wallet'

export const EnableWalletActions = {
  walletEnabled: (chaindId: ChainId) =>
    createAction('wallet/walletEnabled', { chaindId }),
}

export type EnableWalletActionTypes = ActionsUnion<typeof EnableWalletActions>
