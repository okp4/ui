import { OrderedMap, OrderedSet } from 'immutable'
import short from 'short-uuid'
import { EventBus } from 'ts-bus'
import type { ReduxStore } from '../../store/store'
import { ErrorBuilder } from 'domain/error/builder/error.builder'
import type { Task } from 'domain/task/entity/task'
import type { AppState } from 'domain/task/store/appState'
import { TaskBuilder } from 'domain/task/builder/task.builder'
import {
  getExpectedEventParameter,
  expectEventParameters,
  EventParameter
} from 'domain/common/test.helper'
import { TaskStoreBuilder } from 'domain/task/store/builder/store.builder'
import { TaskRemovedPayload } from 'domain/task/event/taskRemoved'
import { AcknowledgeTask } from 'domain/task/command/acknowledgeTask'
import { TaskAcknowledgedPayload } from 'domain/task/event/taskAcknowledged'
import { acknowledgeTask } from './acknowledgeTask'

type InitialProps = Readonly<{
  store: ReduxStore
}>

type Data = {
  taskToAcknowledge: AcknowledgeTask
  expectedState: AppState
  expectedEventParameters: EventParameter<TaskAcknowledgedPayload>[]
}

const eventBus = new EventBus()
const mockedEventBusPublish = jest.spyOn(eventBus, 'publish')
jest.mock('../../entity/error')

const init = (preloadedState: AppState): InitialProps => {
  const store = new TaskStoreBuilder()
    .withEventBus(eventBus)
    .withPreloadedState(preloadedState)
    .build()
  return { store }
}

describe('Acknowledge a task', () => {
  const fakedDate = new Date('2021-01-01T09:00:00.000Z')
  const fakedUuid = 'foobar'
  const initiator = 'domain:task'

  // Commands
  const taskToAcknowledge1: AcknowledgeTask = { id: 'id1' }
  const taskToAcknowledge2: AcknowledgeTask = { id: 'id2' }
  const taskToAcknowledge3: AcknowledgeTask = { id: fakedUuid }

  // Event payloads
  const taskAcknowledgedPayload1: TaskRemovedPayload = {
    id: 'id1'
  }

  const taskAcknowledgedPayload2: TaskRemovedPayload = {
    id: 'id2'
  }

  // Entities
  const task1 = new TaskBuilder()
    .withId('id1')
    .withCreationDate(fakedDate)
    .withLastUpdateDate(fakedDate)
    .withType('task-test')
    .withStatus('processing')
    .withInitiator(initiator)
    .build()

  const task2 = new TaskBuilder()
    .withId('id2')
    .withCreationDate(fakedDate)
    .withLastUpdateDate(fakedDate)
    .withType('task-test')
    .withStatus('processing')
    .withInitiator(initiator)
    .build()

  const error = new ErrorBuilder()
    .withId(fakedUuid)
    .withTimestamp(fakedDate)
    .withMessageKey('domain.error.unspecified-error')
    .withType('unspecified-error')
    .build()

  // States
  const preloadedState: AppState = {
    task: {
      byId: OrderedMap<string, Task>().set(task1.id, task1).set(task2.id, task2),
      byType: OrderedMap<string, OrderedSet<string>>().set(
        task1.type,
        OrderedSet<string>([task1.id, task2.id])
      )
    },
    displayedTaskIds: OrderedSet<string>([task1.id, task2.id])
  }

  const expectedDisplayedTaskIds1 = { displayedTaskIds: OrderedSet<string>([task2.id]) }
  const expectedDisplayedTaskIds2 = { displayedTaskIds: OrderedSet<string>([task1.id]) }

  beforeAll(() => {
    short.generate = jest.fn(() => fakedUuid as short.SUUID)
  })

  describe.each`
    taskToAcknowledge     | expectedState                                          | expectedEventParameters
    ${{}}                 | ${preloadedState}                                      | ${[]}
    ${taskToAcknowledge1} | ${{ ...preloadedState, ...expectedDisplayedTaskIds1 }} | ${[getExpectedEventParameter('task/taskAcknowledged', taskAcknowledgedPayload1, initiator, fakedDate)]}
    ${taskToAcknowledge2} | ${{ ...preloadedState, ...expectedDisplayedTaskIds2 }} | ${[getExpectedEventParameter('task/taskAcknowledged', taskAcknowledgedPayload2, initiator, fakedDate)]}
    ${taskToAcknowledge3} | ${preloadedState}                                      | ${[getExpectedEventParameter('error/errorThrown', error, initiator, fakedDate)]}
  `(
    `Given a task to acknowledge <$taskToAcknowledge>`,
    ({ taskToAcknowledge, expectedState, expectedEventParameters }: Data): void => {
      const { store }: InitialProps = init(preloadedState)

      describe('When acknowledging a task', () => {
        afterAll(() => {
          jest.clearAllMocks()
        })
        test(`Then, expect state to be ${JSON.stringify(
          expectedState
        )} and eventParameters to be ${JSON.stringify(expectedEventParameters)}`, async () => {
          await store.dispatch(acknowledgeTask(taskToAcknowledge))
          expect(store.getState()).toStrictEqual(expectedState)
          expectEventParameters<TaskAcknowledgedPayload>(
            expectedEventParameters,
            mockedEventBusPublish
          )
        })
      })
    }
  )
})
