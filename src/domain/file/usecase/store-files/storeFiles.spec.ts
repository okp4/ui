import { OrderedMap, OrderedSet } from 'immutable'
import short from 'short-uuid'
import { EventBus } from 'ts-bus'
import type { ReduxStore } from '../../store/store'
import { ErrorBuilder } from 'domain/error/builder/error.builder'
import type { AppState } from 'domain/file/store/appState'
import {
  EventParameter,
  expectEventParameters,
  getExpectedEventParameter
} from 'domain/common/test.helper'
import { StoreFile, StoreFiles } from 'domain/file/command/storeFiles'
import { FileStoredPayload } from 'domain/file/events/file-stored/fileStored'
import { FileStoreBuilder } from 'domain/file/store/builder/store.builder'
import { FileEntity } from 'domain/file/entity/file'
import { FileBuilder } from 'domain/file/builder/file.builder'
import { storeFiles } from './storeFiles'

type InitialProps = Readonly<{
  store: ReduxStore
}>

type Data = {
  filesToStore: StoreFiles
  preloadedState: AppState
  expectedState: AppState
  expectedEventParameters: EventParameter<FileStoredPayload>[]
}

const eventBus = new EventBus()
const mockedEventBusPublish = jest.spyOn(eventBus, 'publish')
jest.mock('../../entity/error')

const init = (preloadedState: AppState): InitialProps => {
  const store = new FileStoreBuilder()
    .withEventBus(eventBus)
    .withPreloadedState(preloadedState)
    .build()
  return { store }
}

describe('Store files', () => {
  const fakedDate = new Date('2021-01-01T09:00:00.000Z')
  const fakedUuid = 'foobar'
  const initiator = 'domain:file'
  const stream = new ReadableStream()

  // Commands
  const fileToStore1: StoreFile = {
    id: 'id1',
    name: 'image1',
    size: 1000,
    type: 'image/png',
    stream
  }

  const fileToStore2: StoreFile = {
    id: 'id2',
    name: 'image2',
    size: 10000,
    type: 'image/png',
    stream
  }

  const fileToStore3: StoreFile = {
    id: 'id1',
    name: 'report3',
    size: 10000,
    type: 'xls',
    stream
  }

  // Event payloads
  const fileStoredPayload1: FileStoredPayload = {
    id: fileToStore1.id,
    name: fileToStore1.name,
    size: fileToStore1.size,
    type: fileToStore1.type,
    stream: fileToStore1.stream
  }

  const fileStoredPayload2: FileStoredPayload = {
    id: fileToStore2.id,
    name: fileToStore2.name,
    size: fileToStore2.size,
    type: fileToStore2.type,
    stream: fileToStore2.stream
  }

  // Entities
  const file1 = new FileBuilder()
    .withId(fileToStore1.id)
    .withName(fileToStore1.name)
    .withSize(fileToStore1.size)
    .withType(fileToStore1.type)
    .withStream(fileToStore1.stream)
    .build()

  const file2 = new FileBuilder()
    .withId(fileToStore2.id)
    .withName(fileToStore2.name)
    .withSize(fileToStore2.size)
    .withType(fileToStore2.type)
    .withStream(fileToStore2.stream)
    .build()

  const error = new ErrorBuilder()
    .withId(fakedUuid)
    .withTimestamp(fakedDate)
    .withMessageKey('domain.error.unspecified-error')
    .withType('unspecified-error')
    .build()

  //States
  const state1: AppState = {
    file: {
      byId: OrderedMap<string, FileEntity>(),
      byType: OrderedMap<string, OrderedSet<string>>()
    }
  }

  const state2: AppState = {
    file: {
      byId: OrderedMap<string, FileEntity>().set(file1.id, file1).set(file2.id, file2),
      byType: OrderedMap<string, OrderedSet<string>>().set(
        file1.type,
        OrderedSet<string>().add(file1.id).add(file2.id)
      )
    }
  }

  beforeAll(() => {
    short.generate = jest.fn(() => fakedUuid as short.SUUID)
  })

  describe.each`
    filesToStore                    | preloadedState | expectedState | expectedEventParameters
    ${[]}                           | ${state1}      | ${state1}     | ${[]}
    ${[fileToStore1, fileToStore2]} | ${state1}      | ${state2}     | ${[getExpectedEventParameter('file/fileStored', fileStoredPayload1, initiator, fakedDate), getExpectedEventParameter('file/fileStored', fileStoredPayload2, initiator, fakedDate)]}
    ${[fileToStore1, fileToStore3]} | ${state1}      | ${state1}     | ${[getExpectedEventParameter('error/errorThrown', error, initiator, fakedDate)]}
    ${[fileToStore2]}               | ${state2}      | ${state2}     | ${[getExpectedEventParameter('error/errorThrown', error, initiator, fakedDate)]}
  `(
    `Given that there are $filesToStore.length file(s) to store`,
    ({ filesToStore, preloadedState, expectedState, expectedEventParameters }: Data): void => {
      const { store }: InitialProps = init(preloadedState)

      describe('When storing files', () => {
        afterAll(() => {
          jest.clearAllMocks()
        })
        test(`Then, expect state to be ${expectedState} and eventParameters to be ${expectedEventParameters}`, async () => {
          await store.dispatch(storeFiles(filesToStore))
          expect(store.getState()).toStrictEqual(expectedState)
          expectEventParameters<FileStoredPayload>(expectedEventParameters, mockedEventBusPublish)
        })
      })
    }
  )
})
