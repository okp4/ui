import { OrderedMap, OrderedSet } from 'immutable'
import { EventBus } from 'ts-bus'
import type { DeepReadonly } from 'superTypes'
import type { AppState } from '../../store/appState'
import { FileStoreBuilder } from '../builder/store.builder'
import { FileBuilder } from '../../builder/file.builder'
import { FileDescriptor, getFiles, getFilesSizeByIds, getTotalFilesSize } from './file.selector'
import { FileEntity } from 'domain/file/entity/file'

type Data = DeepReadonly<{
  state: AppState
  fileIds: string[]
  expectedFiles: ReturnType<typeof getFiles>
  expectedFilesSizeByIds: ReturnType<typeof getFilesSizeByIds>
  expectedTotalFilesSize: ReturnType<typeof getTotalFilesSize>
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
  [file1, file2].map(({ id, name, size, type }) => ({ id, name, size, type }))

describe.each`
  state             | fileIds       | expectedFiles      | expectedFilesSizeByIds | expectedTotalFilesSize
  ${undefined}      | ${[]}         | ${[]}              | ${0}                   | ${0}
  ${preloadedState} | ${[]}         | ${expectedFiles()} | ${0}                   | ${200}
  ${preloadedState} | ${['foobar']} | ${expectedFiles()} | ${0}                   | ${200}
  ${preloadedState} | ${['id1']}    | ${expectedFiles()} | ${100}                 | ${200}
`(
  'Given that state is <$state> and fileIds are <$fileIds>',
  ({
    state,
    fileIds,
    expectedFiles,
    expectedFilesSizeByIds,
    expectedTotalFilesSize
  }: Data): void => {
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
    describe('When performing selection getFilesSizeByIds', () => {
      const v = getFilesSizeByIds(store().getState(), fileIds)

      test(`Then, expect value to be ${expectedFilesSizeByIds}`, () => {
        expect(v).toEqual(expectedFilesSizeByIds)
      })
    })
    describe('When performing selection getTotalFilesSize', () => {
      const v = getTotalFilesSize(store().getState())

      test(`Then, expect value to be ${expectedTotalFilesSize}`, () => {
        expect(v).toEqual(expectedTotalFilesSize)
      })
    })
  }
)
