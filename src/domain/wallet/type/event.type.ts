import type { TypedBusEvent } from 'eventBus/eventBus'
import type { DeepReadonly } from 'superTypes'
import type { EnableWalletActions } from '../usecases/enable-wallet/actionCreators'

export type WalletConnectedEvent = DeepReadonly<
  ReturnType<typeof EnableWalletActions['walletConnected']>
>
export type WalletAccountsRetrievedEvent = TypedBusEvent<
  DeepReadonly<ReturnType<typeof EnableWalletActions['accountsRetrieved']>>
>
