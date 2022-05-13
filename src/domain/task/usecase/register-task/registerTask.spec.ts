import { OrderedMap, OrderedSet } from 'immutable'
import short from 'short-uuid'
import { EventBus } from 'ts-bus'
import { configureStore } from '../../store/store'
import type { ReduxStore } from '../../store/store'
import { registerTask } from './registerTask'
import { ErrorBuilder } from 'domain/error/builder/error.builder'
import type { Error } from 'domain/error/entity/error'
import type { Task } from 'domain/task/entity/task'
import type { AppState } from 'domain/task/store/appState'
import type { DeepReadonly, Pair } from 'superTypes'
import type { EventMetadata } from 'eventBus/eventBus'
import { TaskBuilder } from 'domain/task/builder/task.builder'

type InitialProps = Readonly<{
  store: ReduxStore
}>

type EventParameter = Pair<{ type: string; payload: Error | { task: Task } }, EventMetadata>

type Data = {
  task: Task[]
  expectedState: AppState
  expectedEventParameters: EventParameter[]
}

const eventBus = new EventBus()
const mockedEventBusPublish = jest.spyOn(eventBus, 'publish')
jest.mock('../../entity/error')

const init = (): InitialProps => {
  const store = configureStore(eventBus)
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
            unseenTaskId: cur.id
          }
        : acc
    },
    {
      task: { byId: OrderedMap<string, Task>(), byType: OrderedMap<string, OrderedSet<string>>() },
      unseenTaskId: null
    }
  )

const getExpectedEventParameter = (
  type: string,
  payload: Task | Error,
  date: Readonly<Date>,
  hasError?: boolean
): EventParameter => {
  const eventType = { type }
  const eventPayload = {
    payload: hasError ? (payload as Error) : { task: payload as Task }
  }
  const meta = { initiator: 'domain:task', timestamp: date }
  return [{ ...eventType, ...eventPayload }, { ...meta }]
}

describe('Register a task', () => {
  const fakedDate = new Date(2022, 1, 1)
  const fakedUuid = 'foobar'
  const aDate = new Date()

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
    ${[task1]}               | ${getExpectedState([task1])}                  | ${[getExpectedEventParameter('task/taskRegistered', task1, fakedDate)]}
    ${[task1, task2]}        | ${getExpectedState([task1, task2])}           | ${[getExpectedEventParameter('task/taskRegistered', task1, fakedDate), getExpectedEventParameter('task/taskRegistered', task2, fakedDate)]}
    ${[task1, task2, task3]} | ${getExpectedState([task1, task2, task3], 2)} | ${[getExpectedEventParameter('task/taskRegistered', task1, fakedDate), getExpectedEventParameter('task/taskRegistered', task2, fakedDate), getExpectedEventParameter('error/errorThrown', error, fakedDate, true)]}
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
