import type { Store, AnyAction } from 'redux'
import { EventBus } from 'ts-bus'
import { UnspecifiedError } from 'domain/file/entity/error'
import type { DeepReadonly } from 'superTypes'
import type { AppState } from '../appState'
import { configureStore } from '../store'

export type FileStoreParameters = {
  eventBus: EventBus | null
  preloadedState?: AppState
}

export class FileStoreBuilder {
  private readonly fileStoreParameters: FileStoreParameters

  constructor(
    fileStoreParameters: DeepReadonly<FileStoreParameters> = {
      eventBus: null
    }
  ) {
    this.fileStoreParameters = fileStoreParameters
  }

  public withEventBus(eventBus: DeepReadonly<EventBus>): FileStoreBuilder {
    if (!(eventBus instanceof EventBus)) {
      throw new UnspecifiedError(
        'Ooops... A valid eventBus instance must be provided to build a File store...'
      )
    }
    return new FileStoreBuilder({
      ...this.fileStoreParameters,
      eventBus
    })
  }

  public withPreloadedState(preloadedState: DeepReadonly<AppState>): FileStoreBuilder {
    if (!Object.keys(preloadedState).length) {
      throw new UnspecifiedError(
        'Ooops... A valid preloadedState must be provided to build a File store...'
      )
    }
    return new FileStoreBuilder({
      ...this.fileStoreParameters,
      preloadedState
    })
  }

  public build(): Store<AppState, AnyAction> {
    if (!this.invariant()) {
      throw new UnspecifiedError(
        'Ooops... Something went wrong when trying to build a File store...'
      )
    }
    const fileStore = configureStore(
      this.fileStoreParameters.eventBus as EventBus,
      this.fileStoreParameters.preloadedState ?? undefined
    )
    return fileStore
  }

  private invariant(): boolean {
    return (
      (this.fileStoreParameters.preloadedState
        ? Object.keys(this.fileStoreParameters.preloadedState).length > 0
        : true) &&
      !!this.fileStoreParameters.eventBus &&
      this.fileStoreParameters.eventBus instanceof EventBus
    )
  }
}
