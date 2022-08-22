import { OrderedMap, OrderedSet } from 'immutable'
import { EventBus } from 'ts-bus'
import type { ReduxStore } from '../../store/store'
import { storeFiles } from './storeFiles'
import type { FileEntity } from 'domain/file/entity/file'
import type { AppState } from 'domain/file/store/appState'
import type { DeepReadonly } from 'superTypes'
import { FileBuilder } from 'domain/file/builder/file.builder'
import { FileStoreBuilder } from 'domain/file/store/builder/store.builder'
import { StoreFilePayload } from 'domain/file/command/storeFile'

type Data = {
  files: FileEntity[]
  preloadedState: AppState
  expectedState: AppState
}

describe('Store files', () => {
  const stream = new ReadableStream()

  // Commands payloads
  const rawFile1: StoreFilePayload = {
    id: 'id1',
    name: 'image1',
    size: 1000,
    type: 'image/png',
    stream
  }

  const rawFile2: StoreFilePayload = {
    id: 'id2',
    name: 'image2',
    size: 10000,
    type: 'image/png',
    stream
  }

  const rawFile3: StoreFilePayload = {
    id: 'id1',
    name: 'report3',
    size: 10000,
    type: 'xls',
    stream
  }

  // Entities
  const file1 = new FileBuilder()
    .withId('id1')
    .withName('image1')
    .withSize(1000)
    .withType('image/png')
    .withStream(stream)
    .build()

  const file2 = new FileBuilder()
    .withId('id2')
    .withName('image2')
    .withSize(10000)
    .withType('image/png')
    .withStream(stream)
    .build()

  const initialState: AppState = {
    file: {
      byId: OrderedMap<string, FileEntity>(),
      byType: OrderedMap<string, OrderedSet<string>>()
    }
  }

  const state1: AppState = {
    file: {
      byId: OrderedMap<string, FileEntity>().set(file1.id, file1).set(file2.id, file2),
      byType: OrderedMap<string, OrderedSet<string>>().set(
        file1.type,
        OrderedSet<string>().add(file1.id).add(file2.id)
      )
    }
  }

  describe.each`
    files                   | preloadedState | expectedState
    ${[]}                   | ${undefined}   | ${initialState}
    ${[rawFile1, rawFile2]} | ${undefined}   | ${state1}
    ${[rawFile1, rawFile3]} | ${undefined}   | ${initialState}
    ${[rawFile2]}           | ${state1}      | ${state1}
  `(
    `Given that there are $files.length file(s) to store`,
    ({ files, preloadedState, expectedState }: DeepReadonly<Data>): void => {
      const eventBus = new EventBus()
      let storeBuilder = new FileStoreBuilder().withEventBus(eventBus)
      if (preloadedState) {
        storeBuilder = storeBuilder.withPreloadedState(preloadedState)
      }
      const store: ReduxStore = storeBuilder.build()
      describe('When storing files', () => {
        test('Then, expect state to be', async () => {
          await store.dispatch(storeFiles(files))
          expect(store.getState()).toStrictEqual(expectedState)
        })
      })
    }
  )
})
