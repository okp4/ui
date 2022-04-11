import { eventBus } from 'event/eventBus'
import type { WalletAccountsRetrieved } from 'event/walletTypes'
import { setAddress } from 'domain/faucet/usecase/set-address/setAddress'
import type { ReduxStore } from 'domain/faucet/store/store'
import type { DeepReadonly } from 'superTypes'

export const initFaucetEventListeners = (store: DeepReadonly<ReduxStore>): (() => void) =>
  eventBus.subscribe('wallet/accountsRetrieved', (event: WalletAccountsRetrieved) => {
    const address = event.payload.accounts.get(0)?.address
    if (address) {
      store.dispatch(setAddress(address))
    }
  })
