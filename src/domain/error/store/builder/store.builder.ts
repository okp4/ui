import type { Store, AnyAction } from 'redux'
import { EventBus } from 'ts-bus'
import { initErrorEventListeners } from 'adapters/error/primary/eventListeners'
import type { DeepReadonly } from 'superTypes'
import type { AppState } from '../appState'
import { configureStore } from '../store'
import { UnspecifiedError } from 'domain/error/entity/error'

export type ErrorStoreParameters = { preloadedState?: AppState; eventBus: EventBus | null }

export class ErrorStoreBuilder {
  private readonly errorStoreParameters: ErrorStoreParameters

  constructor(
    errorStoreParameters: DeepReadonly<ErrorStoreParameters> = {
      eventBus: null
    }
  ) {
    this.errorStoreParameters = errorStoreParameters
  }

  public withPreloadedState(preloadedState: DeepReadonly<AppState>): ErrorStoreBuilder {
    if (!Object.keys(preloadedState).length) {
      throw new UnspecifiedError(
        'Ooops... A valid preloadedState must be provided to build an Error store...'
      )
    }
    return new ErrorStoreBuilder({
      ...this.errorStoreParameters,
      preloadedState
    })
  }

  public withEventBus(eventBus: DeepReadonly<EventBus>): ErrorStoreBuilder {
    if (!(eventBus instanceof EventBus)) {
      throw new UnspecifiedError(
        'Ooops... A valid eventBus instance must be provided to build an Error store...'
      )
    }
    return new ErrorStoreBuilder({
      ...this.errorStoreParameters,
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
      this.errorStoreParameters.eventBus as EventBus,
      this.errorStoreParameters.preloadedState ?? undefined
    )
    initErrorEventListeners(errorStore, this.errorStoreParameters.eventBus as EventBus)
    return errorStore
  }

  private invariant(): boolean {
    return (
      (this.errorStoreParameters.preloadedState
        ? Object.keys(this.errorStoreParameters.preloadedState).length > 0
        : true) &&
      !!this.errorStoreParameters.eventBus &&
      this.errorStoreParameters.eventBus instanceof EventBus
    )
  }
}
