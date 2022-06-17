import type { Store, AnyAction } from 'redux'
import { EventBus } from 'ts-bus'
import { initTaskEventListeners } from 'adapters/task/primary/eventListeners'
import type { DeepReadonly } from 'superTypes'
import type { AppState } from '../appState'
import { configureStore } from '../store'
import { UnspecifiedError } from 'domain/task/entity/error'

export type TaskStoreParameters = { preloadedState?: AppState; eventBus: EventBus | null }

export class TaskStoreBuilder {
  private readonly taskStoreParameters: TaskStoreParameters

  constructor(
    taskStoreParameters: DeepReadonly<TaskStoreParameters> = {
      eventBus: null
    }
  ) {
    this.taskStoreParameters = taskStoreParameters
  }

  public withPreloadedState(preloadedState: DeepReadonly<AppState>): TaskStoreBuilder {
    if (!Object.keys(preloadedState).length) {
      throw new UnspecifiedError(
        'Ooops... A valid preloadedState must be provided to build a Task store...'
      )
    }
    return new TaskStoreBuilder({
      ...this.taskStoreParameters,
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
      ...this.taskStoreParameters,
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
      this.taskStoreParameters.eventBus as EventBus,
      this.taskStoreParameters.preloadedState ?? undefined
    )
    initTaskEventListeners(taskStore, this.taskStoreParameters.eventBus as EventBus)
    return taskStore
  }

  private invariant(): boolean {
    return (
      (this.taskStoreParameters.preloadedState
        ? Object.keys(this.taskStoreParameters.preloadedState).length > 0
        : true) &&
      !!this.taskStoreParameters.eventBus &&
      this.taskStoreParameters.eventBus instanceof EventBus
    )
  }
}
