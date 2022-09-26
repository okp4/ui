import short from 'short-uuid'
import { EventBus } from 'ts-bus'
import { ErrorBuilder } from 'domain/error/builder/error.builder'
import { InMemoryFileGateway } from 'adapters/file/secondary/InMemoryFileGateway'
import type { ReduxStore } from 'domain/file/store/store'
import {
  getExpectedEventParameter,
  EventParameter,
  expectEventParameters,
  cleanErrorStack
} from 'domain/common/test.helper'
import { TaskRegisterReceivedPayload } from 'domain/task/event/taskRegisterReceived'
import { TaskStatusAmendReceivedPayload } from 'domain/task/event/taskStatusAmendReceived'
import { TaskProgressValueSetReceivedPayload } from 'domain/task/event/taskProgressValueSetReceived'
import { UploadFiles } from 'domain/file/command/uploadFiles'
import { FileStoreBuilder } from 'domain/file/store/builder/store.builder'
import { FileRegistryGateway } from 'adapters/file'
import { uploadFiles } from './uploadFiles'
import { AppState } from 'domain/file/store/appState'
import { OrderedMap, OrderedSet } from 'immutable'
import { FileEntity } from 'domain/file/entity/file'
import { FileBuilder } from 'domain/file/builder/file.builder'
import { UnspecifiedError, UploadError } from 'domain/file/entity/error'
import { Error } from 'domain/error/entity/error'

interface InitialProps {
  store: ReduxStore
  fileGateway: InMemoryFileGateway
  fileRegistryGateway: FileRegistryGateway
}

interface Data {
  hasUploadError: boolean
  hasUnspecifiedError: boolean
  clearFileRegistryGateway: boolean
  filesToUpload: UploadFiles
  preloadedState: AppState
  expectedState: AppState
  expectedEventParameters: EventParameter<
    | TaskRegisterReceivedPayload
    | TaskStatusAmendReceivedPayload
    | TaskProgressValueSetReceivedPayload
  >[]
}

const eventBus = new EventBus()
const mockedEventBusPublish = jest.spyOn(eventBus, 'publish')
// jest.mock('../../entity/error')

const init = (preloadedState: AppState): InitialProps => {
  const fileRegistryGateway = new FileRegistryGateway()
  const fileGateway = new InMemoryFileGateway()
  fileRegistryGateway.register(fileGateway)
  const store = new FileStoreBuilder()
    .withEventBus(eventBus)
    .withDependencies({ fileRegistryGateway })
    .withPreloadedState(preloadedState)
    .build()
  return { store, fileGateway, fileRegistryGateway }
}

describe('Upload files', () => {
  const initiator = 'domain:file'
  const fakedUuid = 'foobar'
  const fileTaskType = 'file#upload-files'
  const fakedDate = new Date('2021-01-01T09:00:00.000Z')
  const stream = new ReadableStream()

  // Command payloads
  const filesToUpload1: UploadFiles = {
    filePortId: 'in-memory',
    target: ''
  }

  const filesToUpload2: UploadFiles = {
    filePortId: 'in-memory',
    target: 'fake-target',
    fileIds: [fakedUuid]
  }

  const filesToUpload3: UploadFiles = {
    filePortId: 'in-memory',
    target: 'fake-target'
  }

  const filesToUpload4: UploadFiles = {
    filePortId: 'in-memory',
    target: 'fake-target',
    fileIds: ['id1']
  }

  // Event payloads
  const taskToRegister1: TaskRegisterReceivedPayload = {
    id: fakedUuid,
    type: fileTaskType,
    progress: {
      min: 0,
      max: 100,
      current: 0
    }
  }

  const taskStatusToAmend1: TaskStatusAmendReceivedPayload = {
    id: taskToRegister1.id,
    status: 'error'
  }

  const taskStatusToAmend2: TaskStatusAmendReceivedPayload = {
    id: taskToRegister1.id,
    status: 'success'
  }

  const taskProgressValueToSet1: TaskProgressValueSetReceivedPayload = {
    id: taskToRegister1.id,
    progressValue: 5
  }

  // Entities
  const file1 = new FileBuilder()
    .withId('id1')
    .withName('image1')
    .withSize(100)
    .withType('image/png')
    .withStream(stream)
    .build()

  const file2 = new FileBuilder()
    .withId('id2')
    .withName('report1')
    .withSize(1000)
    .withType('csv')
    .withStream(stream)
    .build()

  const unspecifiedError = new ErrorBuilder()
    .withId(fakedUuid)
    .withTimestamp(fakedDate)
    .withMessageKey('domain.error.unspecified-error')
    .withType('unspecified-error')
    .build()

  const gatewayError = new ErrorBuilder()
    .withId(fakedUuid)
    .withTimestamp(fakedDate)
    .withMessageKey('domain.error.gateway-error')
    .withType('gateway-error')
    .build()

  const uploadError = new ErrorBuilder()
    .withId(fakedUuid)
    .withTimestamp(fakedDate)
    .withMessageKey('domain.error.upload-error')
    .withType('upload-error')
    .build()

  // States
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
        OrderedSet<string>([file1.id, file2.id])
      )
    }
  }
  const state3: AppState = {
    file: {
      byId: OrderedMap<string, FileEntity>().set(file1.id, file1),
      byType: OrderedMap<string, OrderedSet<string>>().set(
        file1.type,
        OrderedSet<string>([file1.id])
      )
    }
  }

  // Event paramaters expects
  const getExpectedEventParametersWithError = (error: Error) => [
    getExpectedEventParameter('error/errorThrown', error, initiator, fakedDate)
  ]

  const getCombinedExpectedEventParametersWithError = (error: Error) => [
    getExpectedEventParameter('task/taskRegisterReceived', taskToRegister1, initiator, fakedDate),
    getExpectedEventParameter(
      'task/taskStatusAmendReceived',
      taskStatusToAmend1,
      initiator,
      fakedDate
    ),
    getExpectedEventParametersWithError(error)[0]
  ]

  const expectedEventParameters1 = [
    getExpectedEventParameter('task/taskRegisterReceived', taskToRegister1, initiator, fakedDate),
    getExpectedEventParameter(
      'task/taskProgressValueSetReceived',
      taskProgressValueToSet1,
      initiator,
      fakedDate
    ),
    getExpectedEventParameter(
      'task/taskStatusAmendReceived',
      taskStatusToAmend2,
      initiator,
      fakedDate
    )
  ]

  beforeAll(() => {
    short.generate = jest.fn(() => fakedUuid as short.SUUID)
  })

  describe.each`
    hasUploadError | hasUnspecifiedError | clearFileRegistryGateway | filesToUpload     | preloadedState | expectedState | expectedEventParameters
    ${false}       | ${false}            | ${false}                 | ${filesToUpload1} | ${state2}      | ${state1}     | ${getExpectedEventParametersWithError(unspecifiedError)}
    ${false}       | ${false}            | ${false}                 | ${filesToUpload2} | ${state2}      | ${state1}     | ${getExpectedEventParametersWithError(unspecifiedError)}
    ${false}       | ${false}            | ${false}                 | ${filesToUpload3} | ${state1}      | ${state1}     | ${getExpectedEventParametersWithError(unspecifiedError)}
    ${true}        | ${false}            | ${false}                 | ${filesToUpload3} | ${state3}      | ${state1}     | ${getCombinedExpectedEventParametersWithError(uploadError)}
    ${false}       | ${true}             | ${false}                 | ${filesToUpload3} | ${state3}      | ${state1}     | ${getCombinedExpectedEventParametersWithError(unspecifiedError)}
    ${false}       | ${false}            | ${true}                  | ${filesToUpload3} | ${state2}      | ${state1}     | ${getExpectedEventParametersWithError(gatewayError)}
    ${false}       | ${false}            | ${false}                 | ${filesToUpload3} | ${state3}      | ${state1}     | ${expectedEventParameters1}
    ${false}       | ${false}            | ${false}                 | ${filesToUpload4} | ${state3}      | ${state1}     | ${expectedEventParameters1}
  `(
    'Given that ',
    ({
      hasUploadError,
      hasUnspecifiedError,
      clearFileRegistryGateway,
      filesToUpload,
      preloadedState,
      expectedState,
      expectedEventParameters
    }: Readonly<Data>): void => {
      const { store, fileGateway, fileRegistryGateway }: InitialProps = init(preloadedState)
      hasUploadError && fileGateway.setUploadError()
      hasUnspecifiedError && fileGateway.setUnspecifiedError()
      clearFileRegistryGateway && fileRegistryGateway.clear()
      describe('When uploading files', () => {
        afterAll(() => {
          jest.clearAllMocks()
        })
        test('Then, ', async () => {
          await store.dispatch(uploadFiles(filesToUpload))
          expect(store.getState()).toStrictEqual(expectedState)
          cleanErrorStack(mockedEventBusPublish)
          expectEventParameters<
            | TaskRegisterReceivedPayload
            | TaskStatusAmendReceivedPayload
            | TaskProgressValueSetReceivedPayload
          >(expectedEventParameters, mockedEventBusPublish)
        })
      })
    }
  )
})
