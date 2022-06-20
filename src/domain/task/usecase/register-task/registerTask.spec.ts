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

type InitialProps = Readonly<{
  store: ReduxStore
}>

type Data = {
  task: Task[]
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

  const task1 = new TaskBuilder()
    .withId('id1')
    .withCreationDate(aDate)
    .withLastUpdateDate(aDate)
    .withMessageKey('domain.task.test')
    .withType('task-test')
    .withStatus('processing')
    .build()

  const task2 = new TaskBuilder()
    .withId('id2')
    .withCreationDate(aDate)
    .withLastUpdateDate(aDate)
    .withMessageKey('domain.task.test')
    .withType('task-test')
    .withStatus('processing')
    .build()

  const task3 = new TaskBuilder()
    .withId('id1')
    .withCreationDate(aDate)
    .withLastUpdateDate(aDate)
    .withMessageKey('domain.task.test')
    .withType('task-test')
    .withStatus('processing')
    .build()

  const error = new ErrorBuilder()
    .withId(fakedUuid)
    .withTimestamp(fakedDate)
    .withMessageKey('domain.error.unspecified-error')
    .withType('unspecified-error')
    .build()

  beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(fakedDate)
    short.generate = jest.fn(() => fakedUuid as short.SUUID)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe.each`
    task                     | expectedState                                 | expectedEventParameters
    ${[]}                    | ${getExpectedState([])}                       | ${[]}
    ${[task1]}               | ${getExpectedState([task1])}                  | ${[getExpectedEventParameter('task/taskRegistered', task1, initiator, fakedDate)]}
    ${[task1, task2]}        | ${getExpectedState([task1, task2])}           | ${[getExpectedEventParameter('task/taskRegistered', task1, initiator, fakedDate), getExpectedEventParameter('task/taskRegistered', task2, initiator, fakedDate)]}
    ${[task1, task2, task3]} | ${getExpectedState([task1, task2, task3], 2)} | ${[getExpectedEventParameter('task/taskRegistered', task1, initiator, fakedDate), getExpectedEventParameter('task/taskRegistered', task2, initiator, fakedDate), getExpectedEventParameter('error/errorThrown', error, initiator, fakedDate)]}
  `(
    `Given that there are $task.length task(s) to register`,
    ({ task, expectedState, expectedEventParameters }: DeepReadonly<Data>): void => {
      const { store }: InitialProps = init()

      describe('When registering a task', () => {
        afterAll(() => {
          jest.clearAllMocks()
        })
        test('Then, expect state and eventParameters to be', async () => {
          await task.forEach((elt: Task) => {
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
