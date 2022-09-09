import { OrderedMap, OrderedSet } from 'immutable'
import short from 'short-uuid'
import { EventBus } from 'ts-bus'
import type { ReduxStore } from '../../store/store'
import { ErrorBuilder } from 'domain/error/builder/error.builder'
import type { Task } from 'domain/task/entity/task'
import type { AppState } from 'domain/task/store/appState'
import { TaskBuilder } from 'domain/task/builder/task.builder'
import type { EventParameter } from '../../helper/test.helper'
import { getExpectedEventParameter } from '../../helper/test.helper'
import { TaskStoreBuilder } from 'domain/task/store/builder/store.builder'
import { TaskRemovedPayload } from 'domain/task/event/taskRemoved'
import { removeTask } from './removeTask'
import { RemoveTask } from 'domain/task/command/removeTask'
import { getExpectedStateAfterRemove, expectEventParameters } from 'domain/task/helper/test.helper'

type InitialProps = Readonly<{
  store: ReduxStore
}>

type Data = {
  taskToRemove: RemoveTask
  expectedState: AppState
  expectedEventParameters: EventParameter<TaskRemovedPayload>[]
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

describe('Remove a task', () => {
  const fakedDate = new Date('2021-01-01T09:00:00.000Z')
  const fakedUuid = 'foobar'
  const initiator = 'domain:task'

  // Commands
  const taskToRemove1: RemoveTask = { id: 'id1' }
  const taskToRemove2: RemoveTask = { id: 'id2' }
  const taskToRemove3: RemoveTask = { id: fakedUuid }

  // Event payloads
  const taskRemovedPayload1: TaskRemovedPayload = {
    id: 'id1'
  }

  const taskRemovedPayload2: TaskRemovedPayload = {
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

  beforeAll(() => {
    short.generate = jest.fn(() => fakedUuid as short.SUUID)
  })

  describe.each`
    taskToRemove     | expectedState                                           | expectedEventParameters
    ${{}}            | ${preloadedState}                                       | ${[]}
    ${taskToRemove1} | ${getExpectedStateAfterRemove(preloadedState, [task1])} | ${[getExpectedEventParameter('task/taskRemoved', taskRemovedPayload1, initiator, fakedDate)]}
    ${taskToRemove2} | ${getExpectedStateAfterRemove(preloadedState, [task2])} | ${[getExpectedEventParameter('task/taskRemoved', taskRemovedPayload2, initiator, fakedDate)]}
    ${taskToRemove3} | ${preloadedState}                                       | ${[getExpectedEventParameter('error/errorThrown', error, initiator, fakedDate)]}
  `(
    `Given a task to remove <$taskToRemove>`,
    ({ taskToRemove, expectedState, expectedEventParameters }: Data): void => {
      const { store }: InitialProps = init(preloadedState)

      describe('When removing a task', () => {
        afterAll(() => {
          jest.clearAllMocks()
        })
        test(`Then, expect state to be ${JSON.stringify(
          expectedState
        )} and eventParameters to be ${JSON.stringify(expectedEventParameters)}`, async () => {
          await store.dispatch(removeTask(taskToRemove))
          expect(store.getState()).toStrictEqual(expectedState)
          expectEventParameters<TaskRemovedPayload>(expectedEventParameters, mockedEventBusPublish)
        })
      })
    }
  )
})
