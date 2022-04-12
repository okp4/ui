import type { DeepReadonly } from 'superTypes'
import type { ErrorWalletActions } from '../usecases/actionCreators'
import type { EnableWalletActions } from '../usecases/enable-wallet/actionCreators'

export type WalletFailedEvent = DeepReadonly<ReturnType<typeof ErrorWalletActions['walletFailed']>>
export type WalletConnectedEvent = DeepReadonly<
  ReturnType<typeof EnableWalletActions['walletConnected']>
>
export type WalletAccountsRetrievedEvent = DeepReadonly<
  ReturnType<typeof EnableWalletActions['accountsRetrieved']>
>
