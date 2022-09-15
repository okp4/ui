import { OrderedMap, OrderedSet } from 'immutable'
import short from 'short-uuid'
import { EventBus } from 'ts-bus'
import type { ReduxStore } from '../../store/store'
import { ErrorBuilder } from 'domain/error/builder/error.builder'
import type { AppState } from 'domain/file/store/appState'
import {
  getExpectedEventParameter,
  EventParameter,
  expectEventParameters
} from 'domain/common/test.helper'
import { RemoveFile } from 'domain/file/command/removeFile'
import { FileRemovedPayload } from 'domain/file/events/file-removed/fileRemoved'
import { FileStoreBuilder } from 'domain/file/store/builder/store.builder'
import { FileBuilder } from 'domain/file/builder/file.builder'
import { FileEntity } from 'domain/file/entity/file'
import { removeFile } from './removeFile'

type InitialProps = Readonly<{
  store: ReduxStore
}>

type Data = {
  fileToRemove: RemoveFile
  expectedState: AppState
  expectedEventParameters: EventParameter<FileRemovedPayload>[]
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

describe('Remove a file', () => {
  const fakedDate = new Date('2021-01-01T09:00:00.000Z')
  const fakedUuid = 'foobar'
  const initiator = 'domain:file'

  // Commands
  const fileToRemove1: RemoveFile = { id: 'id1' }
  const fileToRemove2: RemoveFile = { id: fakedUuid }

  // Event payloads
  const fileRemovedPayload1: FileRemovedPayload = {
    id: 'id1'
  }

  // Entities
  const file1 = new FileBuilder()
    .withId('id1')
    .withName('image1')
    .withSize(100)
    .withType('image/png')
    .withStream(new ReadableStream())
    .build()

  const file2 = new FileBuilder()
    .withId('id2')
    .withName('report1')
    .withSize(1000)
    .withType('csv')
    .withStream(new ReadableStream())
    .build()

  const error = new ErrorBuilder()
    .withId(fakedUuid)
    .withTimestamp(fakedDate)
    .withMessageKey('domain.error.unspecified-error')
    .withType('unspecified-error')
    .build()

  // States
  const state1: AppState = {
    file: {
      byId: OrderedMap<string, FileEntity>().set(file1.id, file1).set(file2.id, file2),
      byType: OrderedMap<string, OrderedSet<string>>().set(
        file1.type,
        OrderedSet<string>([file1.id, file2.id])
      )
    }
  }

  const state2: AppState = {
    file: {
      byId: OrderedMap<string, FileEntity>().set(file2.id, file2),
      byType: OrderedMap<string, OrderedSet<string>>().set(
        file1.type,
        OrderedSet<string>([file2.id])
      )
    }
  }

  beforeAll(() => {
    short.generate = jest.fn(() => fakedUuid as short.SUUID)
  })

  describe.each`
    fileToRemove     | expectedState | expectedEventParameters
    ${{}}            | ${state1}     | ${[]}
    ${fileToRemove1} | ${state2}     | ${[getExpectedEventParameter('file/fileRemoved', fileRemovedPayload1, initiator, fakedDate)]}
    ${fileToRemove2} | ${state1}     | ${[getExpectedEventParameter('error/errorThrown', error, initiator, fakedDate)]}
  `(
    `Given a file to remove <$fileToRemove>`,
    ({ fileToRemove, expectedState, expectedEventParameters }: Data): void => {
      const { store }: InitialProps = init(state1)

      describe('When removing a file', () => {
        afterAll(() => {
          jest.clearAllMocks()
        })
        test(`Then, expect state to be ${expectedState} and eventParameters to be ${expectedEventParameters}`, async () => {
          await store.dispatch(removeFile(fileToRemove))
          expect(store.getState()).toStrictEqual(expectedState)
          expectEventParameters<FileRemovedPayload>(expectedEventParameters, mockedEventBusPublish)
        })
      })
    }
  )
})
