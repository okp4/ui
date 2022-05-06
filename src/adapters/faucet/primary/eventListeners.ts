import type { EventBus } from 'ts-bus'
import type { WalletAccountsRetrievedEvent } from 'domain/wallet/type/event.type'
import type { ReduxStore } from 'domain/faucet/store/store'
import { requestFunds } from 'domain/faucet/usecase/request-funds/requestFunds'
import type { DeepReadonly } from 'superTypes'

export const initFaucetEventListeners = (
  store: DeepReadonly<ReduxStore>,
  eventBus: DeepReadonly<EventBus>
): (() => void) =>
  eventBus.subscribe('wallet/accountsRetrieved', (event: WalletAccountsRetrievedEvent) => {
    const address = event.payload.accounts.get(0)?.address
    if (address) {
      store.dispatch(requestFunds(address))
    }
  })
