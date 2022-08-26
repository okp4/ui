import { OrderedMap, OrderedSet } from 'immutable'
import short from 'short-uuid'
import { EventBus } from 'ts-bus'
import type { ReduxStore } from '../../store/store'
import { registerTask } from './registerTask'
import { ErrorBuilder } from 'domain/error/builder/error.builder'
import type { Task } from 'domain/task/entity/task'
import type { AppState } from 'domain/task/store/appState'
import type { DeepReadonly } from 'superTypes'
import { TaskBuilder } from 'domain/task/builder/task/task.builder'
import type { EventParameter } from '../../helper/test.helper'
import { getExpectedEventParameter } from '../../helper/test.helper'
import { TaskStoreBuilder } from 'domain/task/store/builder/store.builder'
import { CreateTask } from 'domain/task/command/createTask'

type InitialProps = Readonly<{
  store: ReduxStore
}>

type Data = {
  tasks: CreateTask[]
  expectedState: AppState
  expectedEventParameters: EventParameter[]
}

const eventBus = new EventBus()
const mockedEventBusPublish = jest.spyOn(eventBus, 'publish')
jest.mock('../../entity/error')

const init = (): InitialProps => {
  const store = new TaskStoreBuilder().withEventBus(eventBus).build()
  return { store }
}

const getExpectedState = (tasks: DeepReadonly<Task[]>, errorIndex?: number): AppState =>
  tasks.reduce<AppState>(
    (acc: DeepReadonly<AppState>, cur: Task, index: number) => {
      const value = acc.task.byType.get(cur.type)
      return index !== errorIndex
        ? {
            task: {
              byId: acc.task.byId.set(cur.id, cur),
              byType: !value?.size
                ? acc.task.byType.set(cur.type, OrderedSet([cur.id]))
                : acc.task.byType.set(cur.type, value.add(cur.id))
            },
            displayedTaskIds: acc.displayedTaskIds.add(cur.id)
          }
        : acc
    },
    {
      task: { byId: OrderedMap<string, Task>(), byType: OrderedMap<string, OrderedSet<string>>() },
      displayedTaskIds: OrderedSet<string>()
    }
  )

describe('Register a task', () => {
  const fakedDate = new Date(2022, 1, 1)
  const fakedUuid = 'foobar'
  const aDate = new Date()
  const initiator = 'domain:task'

  // Command payloads
  const rawTask1: CreateTask = {
    id: 'id1',
    timestamp: aDate,
    type: 'task-test',
    status: 'processing',
    messageKey: 'domain.task.processing',
    initiator
  }

  const rawTask2: CreateTask = {
    id: 'id2',
    timestamp: aDate,
    type: 'task-test',
    status: 'processing',
    messageKey: 'domain.task.processing',
    initiator
  }

  // Entities
  const task1 = new TaskBuilder()
    .withId(rawTask1.id)
    .withCreationDate(rawTask1.timestamp)
    .withLastUpdateDate(rawTask1.timestamp)
    .withMessageKey(rawTask1.messageKey)
    .withType(rawTask1.type)
    .withStatus(rawTask1.status)
    .withInitiator(rawTask1.initiator)
    .build()

  const task2 = new TaskBuilder()
    .withId(rawTask2.id)
    .withCreationDate(rawTask2.timestamp)
    .withLastUpdateDate(rawTask2.timestamp)
    .withMessageKey(rawTask2.messageKey)
    .withType(rawTask2.type)
    .withStatus(rawTask2.status)
    .withInitiator(rawTask2.initiator)
    .build()

  const error = new ErrorBuilder()
    .withId(fakedUuid)
    .withTimestamp(fakedDate)
    .withMessageKey('domain.error.unspecified-error')
    .withType('unspecified-error')
    .build()

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(fakedDate)
    short.generate = jest.fn(() => fakedUuid as short.SUUID)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe.each`
    tasks                             | expectedState                                 | expectedEventParameters
    ${[]}                             | ${getExpectedState([])}                       | ${[]}
    ${[rawTask1]}                     | ${getExpectedState([task1])}                  | ${[getExpectedEventParameter('task/taskRegistered', task1, initiator, fakedDate)]}
    ${[rawTask1, rawTask2]}           | ${getExpectedState([task1, task2])}           | ${[getExpectedEventParameter('task/taskRegistered', task1, initiator, fakedDate), getExpectedEventParameter('task/taskRegistered', task2, initiator, fakedDate)]}
    ${[rawTask1, rawTask2, rawTask1]} | ${getExpectedState([task1, task2, task1], 2)} | ${[getExpectedEventParameter('task/taskRegistered', task1, initiator, fakedDate), getExpectedEventParameter('task/taskRegistered', task2, initiator, fakedDate), getExpectedEventParameter('error/errorThrown', error, initiator, fakedDate)]}
  `(
    `Given that there are $task.length task(s) to register`,
    ({ tasks, expectedState, expectedEventParameters }: DeepReadonly<Data>): void => {
      const { store }: InitialProps = init()

      describe('When registering a task', () => {
        afterAll(() => {
          jest.clearAllMocks()
        })
        test('Then, expect state and eventParameters to be', async () => {
          await tasks.forEach((elt: CreateTask) => {
            store.dispatch(registerTask(elt))
          })
          expect(store.getState()).toStrictEqual(expectedState)
          if (expectedEventParameters.length) {
            expectedEventParameters.forEach((elt: DeepReadonly<EventParameter>, index: number) => {
              const [first, second]: Readonly<EventParameter> = elt
              expect(mockedEventBusPublish).toHaveBeenNthCalledWith(index + 1, first, second)
            })
          }
        })
      })
    }
  )
})
