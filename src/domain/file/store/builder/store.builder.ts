import type { Store, AnyAction } from 'redux'
import { EventBus } from 'ts-bus'
import { UnspecifiedError } from 'domain/file/entity/error'
import type { DeepReadonly } from 'superTypes'
import type { AppState } from '../appState'
import { configureStore } from '../store'
import type { Dependencies } from 'domain/file/store/store'

export type FileStoreParameters = {
  dependencies: Dependencies | null
  eventBus: EventBus | null
  preloadedState?: AppState
}

export class FileStoreBuilder {
  private readonly fileStoreParameters: FileStoreParameters

  constructor(
    fileStoreParameters: DeepReadonly<FileStoreParameters> = {
      dependencies: null,
      eventBus: null
    }
  ) {
    this.fileStoreParameters = fileStoreParameters
  }

  public withDependencies(dependencies: Dependencies): FileStoreBuilder {
    if (!this.isDependencies(dependencies)) {
      throw new UnspecifiedError('Ooops... Dependencies must be provided to build a File store...')
    }
    return new FileStoreBuilder({ ...this.fileStoreParameters, dependencies })
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
    const fileRegistryGateway = this.fileStoreParameters.dependencies?.fileRegistryGateway
    const fileStore = configureStore(
      { fileRegistryGateway },
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
      (!this.fileStoreParameters.dependencies ||
        this.isDependencies(this.fileStoreParameters.dependencies)) &&
      !!this.fileStoreParameters.eventBus &&
      this.fileStoreParameters.eventBus instanceof EventBus
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isDependencies(value: any): value is Dependencies {
    return 'fileRegistryGateway' in value
  }
}
