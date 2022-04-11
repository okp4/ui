import type { DeepReadonly } from 'superTypes'
import type { EnableWalletActions } from 'domain/wallet/usecases/enable-wallet/actionCreators'

export type WalletAccountsRetrieved = DeepReadonly<
  ReturnType<typeof EnableWalletActions['accountsRetrieved']>
>

export type WalletConnected = DeepReadonly<
  ReturnType<typeof EnableWalletActions['walletConnected']>
>
