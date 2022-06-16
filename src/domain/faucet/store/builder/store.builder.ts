import type { Store, AnyAction } from 'redux'
import { initFaucetEventListeners } from 'adapters/faucet/primary/eventListeners'
import { HTTPFaucetGateway } from 'adapters/faucet/secondary/graphql/HTTPFaucetGateway'
import { UnspecifiedError } from 'domain/faucet/entity/error'
import { eventBus } from 'eventBus/eventBus'
import type { DeepReadonly } from 'superTypes'
import type { AppState } from '../appState'
import { configureStore } from '../store'

export type StoreParameters = { url: string; initEventListeners: boolean }

export class FaucetStoreBuilder {
  private readonly storeParameters: StoreParameters

  constructor(storeParameters?: DeepReadonly<StoreParameters>) {
    if (storeParameters) {
      this.storeParameters = storeParameters
    } else {
      this.storeParameters = {
        url: '',
        initEventListeners: false
      }
    }
  }

  public withFaucetUrl(url: string): FaucetStoreBuilder {
    if (!url.length) {
      throw new UnspecifiedError('Ooops... An url must be provided to build a Faucet store...')
    }
    return new FaucetStoreBuilder({ ...this.storeParameters, url })
  }

  public withFaucetEventListeners(initEventListeners: boolean): FaucetStoreBuilder {
    return new FaucetStoreBuilder({
      ...this.storeParameters,
      initEventListeners
    })
  }

  public build(): Store<AppState, AnyAction> {
    if (!this.invariant()) {
      throw new UnspecifiedError(
        'Ooops... Something went wrong when trying to build a Faucet store...'
      )
    }
    const faucetGateway = new HTTPFaucetGateway(this.storeParameters.url)
    const faucetStore = configureStore({ faucetGateway }, eventBus)
    if (this.storeParameters.initEventListeners) {
      initFaucetEventListeners(faucetStore)
    }
    return faucetStore
  }

  private invariant(): boolean {
    return this.storeParameters.url.length > 0
  }
}
