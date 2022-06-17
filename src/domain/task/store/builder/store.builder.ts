import type { Store, AnyAction } from 'redux'
import { EventBus } from 'ts-bus'
import { initTaskEventListeners } from 'adapters/task/primary/eventListeners'
import type { DeepReadonly } from 'superTypes'
import type { AppState } from '../appState'
import { configureStore } from '../store'
import { UnspecifiedError } from 'domain/task/entity/error'

export type StoreParameters = { preloadedState?: AppState; eventBus: EventBus | null }

export class TaskStoreBuilder {
  private readonly storeParameters: StoreParameters

  constructor(storeParameters?: DeepReadonly<StoreParameters>) {
    if (storeParameters) {
      this.storeParameters = storeParameters
    } else {
      this.storeParameters = {
        eventBus: null
      }
    }
  }

  public withPreloadedState(preloadedState: DeepReadonly<AppState>): TaskStoreBuilder {
    if (!Object.keys(preloadedState).length) {
      throw new UnspecifiedError(
        'Ooops... A valid preloadedState must be provided to build a Task store...'
      )
    }
    return new TaskStoreBuilder({
      ...this.storeParameters,
      preloadedState
    })
  }

  public withEventBus(eventBus: DeepReadonly<EventBus>): TaskStoreBuilder {
    if (!(eventBus instanceof EventBus)) {
      throw new UnspecifiedError(
        'Ooops... A valid eventBus instance must be provided to build a Task store...'
      )
    }
    return new TaskStoreBuilder({
      ...this.storeParameters,
      eventBus
    })
  }

  public build(): Store<AppState, AnyAction> {
    if (!this.invariant()) {
      throw new UnspecifiedError(
        'Ooops... Something went wrong when trying to build a Task store...'
      )
    }
    const taskStore = configureStore(
      this.storeParameters.eventBus as EventBus,
      this.storeParameters.preloadedState ?? undefined
    )
    initTaskEventListeners(taskStore, this.storeParameters.eventBus as EventBus)
    return taskStore
  }

  private invariant(): boolean {
    return (
      (this.storeParameters.preloadedState
        ? Object.keys(this.storeParameters.preloadedState).length > 0
        : true) &&
      !!this.storeParameters.eventBus &&
      this.storeParameters.eventBus instanceof EventBus
    )
  }
}
