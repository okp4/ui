import type { Store, AnyAction } from 'redux'
import { EventBus } from 'ts-bus'
import { initFaucetEventListeners } from 'adapters/faucet/primary/eventListeners'
import { UnspecifiedError } from 'domain/faucet/entity/error'
import type { DeepReadonly } from 'superTypes'
import type { AppState } from '../appState'
import type { Dependencies } from '../store'
import { configureStore } from '../store'

export type FaucetStoreParameters = {
  dependencies: Dependencies | null
  eventBus: EventBus | null
  preloadedState?: AppState
}

export class FaucetStoreBuilder {
  private readonly faucetStoreParameters: FaucetStoreParameters

  constructor(
    faucetStoreParameters: DeepReadonly<FaucetStoreParameters> = {
      dependencies: null,
      eventBus: null
    }
  ) {
    this.faucetStoreParameters = faucetStoreParameters
  }

  public withDependencies(dependencies: Dependencies): FaucetStoreBuilder {
    if (!this.isDependencies(dependencies)) {
      throw new UnspecifiedError(
        'Ooops... Dependencies must be provided to build a Faucet store...'
      )
    }
    return new FaucetStoreBuilder({ ...this.faucetStoreParameters, dependencies })
  }

  public withEventBus(eventBus: DeepReadonly<EventBus>): FaucetStoreBuilder {
    if (!(eventBus instanceof EventBus)) {
      throw new UnspecifiedError(
        'Ooops... A valid eventBus instance must be provided to build a Faucet store...'
      )
    }
    return new FaucetStoreBuilder({
      ...this.faucetStoreParameters,
      eventBus
    })
  }

  public withPreloadedState(preloadedState: DeepReadonly<AppState>): FaucetStoreBuilder {
    if (!Object.keys(preloadedState).length) {
      throw new UnspecifiedError(
        'Ooops... A valid preloadedState must be provided to build a Faucet store...'
      )
    }
    return new FaucetStoreBuilder({
      ...this.faucetStoreParameters,
      preloadedState
    })
  }

  public build(): Store<AppState, AnyAction> {
    if (!this.invariant()) {
      throw new UnspecifiedError(
        'Ooops... Something went wrong when trying to build a Faucet store...'
      )
    }
    const faucetGateway = (this.faucetStoreParameters.dependencies as Dependencies).faucetGateway
    const faucetStore = configureStore(
      { faucetGateway },
      this.faucetStoreParameters.eventBus as EventBus,
      this.faucetStoreParameters.preloadedState ?? undefined
    )
    initFaucetEventListeners(faucetStore, this.faucetStoreParameters.eventBus as EventBus)
    return faucetStore
  }

  private invariant(): boolean {
    return (
      (this.faucetStoreParameters.preloadedState
        ? Object.keys(this.faucetStoreParameters.preloadedState).length > 0
        : true) &&
      !!this.faucetStoreParameters.dependencies &&
      this.isDependencies(this.faucetStoreParameters.dependencies) &&
      !!this.faucetStoreParameters.eventBus &&
      this.faucetStoreParameters.eventBus instanceof EventBus
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isDependencies(value: any): value is Dependencies {
    return 'faucetGateway' in value
  }
}
