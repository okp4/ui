import type { Store, AnyAction } from 'redux'
import { EventBus } from 'ts-bus'
import { initErrorEventListeners } from 'adapters/error/primary/eventListeners'
import type { DeepReadonly } from 'superTypes'
import type { AppState } from '../appState'
import { configureStore } from '../store'
import { UnspecifiedError } from 'domain/error/entity/error'
import { eventBus } from 'eventBus/eventBus'

export type StoreParameters = { preloadedState?: AppState; eventBus: EventBus }

export class ErrorStoreBuilder {
  private readonly storeParameters: StoreParameters

  constructor(storeParameters?: DeepReadonly<StoreParameters>) {
    if (storeParameters) {
      this.storeParameters = storeParameters
    } else {
      this.storeParameters = {
        eventBus
      }
    }
  }

  public withPreloadedState(preloadedState: DeepReadonly<AppState>): ErrorStoreBuilder {
    if (!Object.keys(preloadedState).length) {
      throw new UnspecifiedError(
        'Ooops... A valid preloadedState must be provided to build an Error store...'
      )
    }
    return new ErrorStoreBuilder({
      ...this.storeParameters,
      preloadedState
    })
  }

  public withEventBus(eventBus: DeepReadonly<EventBus>): ErrorStoreBuilder {
    if (!(eventBus instanceof EventBus)) {
      throw new UnspecifiedError(
        'Ooops... A valid eventBus must be provided to build an Error store...'
      )
    }
    return new ErrorStoreBuilder({
      ...this.storeParameters,
      eventBus
    })
  }

  public build(): Store<AppState, AnyAction> {
    if (!this.invariant()) {
      throw new UnspecifiedError(
        'Ooops... Something went wrong when trying to build an Error store...'
      )
    }
    const errorStore = configureStore(
      this.storeParameters.eventBus,
      this.storeParameters.preloadedState ?? undefined
    )
    initErrorEventListeners(errorStore, this.storeParameters.eventBus)
    return errorStore
  }

  private invariant(): boolean {
    return (
      (this.storeParameters.preloadedState
        ? Object.keys(this.storeParameters.preloadedState).length > 0
        : true) && this.storeParameters.eventBus instanceof EventBus
    )
  }
}
