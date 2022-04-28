import type { DeepReadonly } from 'superTypes'
import type { EnableWalletActions } from '../usecases/enable-wallet/actionCreators'

export type WalletConnectedEvent = DeepReadonly<
  ReturnType<typeof EnableWalletActions['walletConnected']>
>
export type WalletAccountsRetrievedEvent = DeepReadonly<
  ReturnType<typeof EnableWalletActions['accountsRetrieved']>
>
