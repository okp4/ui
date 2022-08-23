import { OrderedMap, OrderedSet } from 'immutable'
import { EventBus } from 'ts-bus'
import type { DeepReadonly } from 'superTypes'
import type { AppState } from '../../store/appState'
import { FileStoreBuilder } from '../builder/store.builder'
import { FileBuilder } from '../../builder/file.builder'
import { FileDescriptor, getFiles } from './file.selector'
import { FileEntity } from 'domain/file/entity/file'

type Data = DeepReadonly<{
  state: AppState
  expectedFiles: ReturnType<typeof getFiles>
}>

const file1 = new FileBuilder()
  .withId('id1')
  .withName('image1')
  .withSize(100)
  .withType('image/png')
  .withStream(new ReadableStream())
  .build()

const file2 = new FileBuilder()
  .withId('id2')
  .withName('image2')
  .withSize(100)
  .withType('text/csv')
  .withStream(new ReadableStream())
  .build()

const preloadedState: AppState = {
  file: {
    byId: OrderedMap<string, FileEntity>().set(file1.id, file1).set(file2.id, file2),
    byType: OrderedMap<string, OrderedSet<string>>()
      .set(file1.type, OrderedSet<string>([file1.id]))
      .set(file2.type, OrderedSet<string>([file2.id]))
  }
}

const expectedFiles = (): FileDescriptor[] =>
  [file1, file2].map(({ name, size, type }) => ({ name, size, type }))

describe.each`
  state             | expectedFiles
  ${undefined}      | ${[]}
  ${preloadedState} | ${expectedFiles()}
`('Given that state is <$state>', ({ state, expectedFiles }: Data): void => {
  const store = () => {
    const eventBusInstance = new EventBus()
    let storeBuilder = new FileStoreBuilder()
    if (state) {
      storeBuilder = storeBuilder.withPreloadedState(state)
    }
    return storeBuilder.withEventBus(eventBusInstance).build()
  }
  describe('When performing selection getFiles', () => {
    const v = getFiles(store().getState())

    test(`Then, expect value to be ${expectedFiles}`, () => {
      expect(v).toEqual(expectedFiles)
    })
  })
})
