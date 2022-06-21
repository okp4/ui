import type { Store, AnyAction } from 'redux'
import { EventBus } from 'ts-bus'
import { UnspecifiedError } from 'domain/wallet/entities/errors'
import type { DeepReadonly } from 'superTypes'
import type { AppState } from '../appState'
import type { Dependencies } from '../store'
import { configureStore } from '../store'

export type WalletStoreParameters = {
  dependencies: Dependencies | null
  eventBus: EventBus | null
  preloadedState?: AppState
}

export class WalletStoreBuilder {
  private readonly walletStoreParameters: WalletStoreParameters

  constructor(
    walletStoreParameters: DeepReadonly<WalletStoreParameters> = {
      dependencies: null,
      eventBus: null
    }
  ) {
    this.walletStoreParameters = walletStoreParameters
  }

  public withDependencies(dependencies: Dependencies): WalletStoreBuilder {
    if (!this.isDependencies(dependencies)) {
      throw new UnspecifiedError(
        'Ooops... Dependencies must be provided to build a Wallet store...'
      )
    }
    return new WalletStoreBuilder({ ...this.walletStoreParameters, dependencies })
  }

  public withEventBus(eventBus: DeepReadonly<EventBus>): WalletStoreBuilder {
    if (!(eventBus instanceof EventBus)) {
      throw new UnspecifiedError(
        'Ooops... A valid eventBus instance must be provided to build a Wallet store...'
      )
    }
    return new WalletStoreBuilder({
      ...this.walletStoreParameters,
      eventBus
    })
  }

  public withPreloadedState(preloadedState: DeepReadonly<AppState>): WalletStoreBuilder {
    if (!Object.keys(preloadedState).length) {
      throw new UnspecifiedError(
        'Ooops... A valid preloadedState must be provided to build a Wallet store...'
      )
    }
    return new WalletStoreBuilder({
      ...this.walletStoreParameters,
      preloadedState
    })
  }

  public build(): Store<AppState, AnyAction> {
    if (!this.invariant()) {
      throw new UnspecifiedError(
        'Ooops... Something went wrong when trying to build a Wallet store...'
      )
    }
    const walletRegistryGateway = (this.walletStoreParameters.dependencies as Dependencies)
      .walletRegistryGateway
    const walletStore = configureStore(
      { walletRegistryGateway },
      this.walletStoreParameters.eventBus as EventBus,
      this.walletStoreParameters.preloadedState ?? undefined
    )
    return walletStore
  }

  private invariant(): boolean {
    return (
      (this.walletStoreParameters.preloadedState
        ? Object.keys(this.walletStoreParameters.preloadedState).length > 0
        : true) &&
      !!this.walletStoreParameters.dependencies &&
      this.isDependencies(this.walletStoreParameters.dependencies) &&
      !!this.walletStoreParameters.eventBus &&
      this.walletStoreParameters.eventBus instanceof EventBus
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isDependencies(value: any): value is Dependencies {
    return 'walletRegistryGateway' in value
  }
}
