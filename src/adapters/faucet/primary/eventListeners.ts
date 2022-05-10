import { eventBus } from 'src/eventBus/eventBus'
import type { WalletAccountsRetrievedEvent } from 'domain/wallet/type/event.type'
import { setAddress } from 'domain/faucet/usecase/set-address/setAddress'
import type { ReduxStore } from 'domain/faucet/store/store'
import type { DeepReadonly } from 'superTypes'

export const initFaucetEventListeners = (store: DeepReadonly<ReduxStore>): (() => void) =>
  eventBus.subscribe(
    'wallet/accountsRetrieved',
    (event: DeepReadonly<WalletAccountsRetrievedEvent>) => {
      const address = event.payload.accounts.get(0)?.address
      if (address) {
        store.dispatch(setAddress(address))
      }
    }
  )
