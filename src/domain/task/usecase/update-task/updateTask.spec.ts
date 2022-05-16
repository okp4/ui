import { OrderedMap, OrderedSet } from 'immutable'
import short from 'short-uuid'
import { EventBus } from 'ts-bus'
import { configureStore } from '../../store/store'
import type { ReduxStore } from '../../store/store'
import { updateTask } from './updateTask'
import { ErrorBuilder } from 'domain/error/builder/error.builder'
import type { Task, UpdateTask } from 'domain/task/entity/task'
import type { AppState } from 'domain/task/store/appState'
import type { DeepReadonly } from 'superTypes'
import { TaskBuilder } from 'domain/task/builder/task.builder'
import type { EventParameter } from '../../helper/test.helper'
import { getExpectedEventParameter } from '../../helper/test.helper'

type Data = {
  state: AppState
  updatedTask: UpdateTask[]
  expectedState: AppState
  expectedEventParameters: EventParameter[]
}

const eventBus = new EventBus()
const mockedEventBusPublish = jest.spyOn(eventBus, 'publish')
jest.mock('../../entity/error')

const getExpectedState = (
  iniialState: DeepReadonly<AppState>,
  updatedTasks: DeepReadonly<UpdateTask[]>,
  errorIndex?: number
): AppState =>
  updatedTasks.reduce<AppState>(
    (acc: DeepReadonly<AppState>, cur: UpdateTask, index: number): AppState => {
      const foundTask = acc.task.byId.get(cur.id)
      return index !== errorIndex
        ? {
            task: {
              byId: foundTask ? acc.task.byId.set(cur.id, { ...foundTask, ...cur }) : acc.task.byId,
              byType: acc.task.byType
            },
            displayedTaskIds: acc.displayedTaskIds.add(cur.id)
          }
        : acc
    },
    iniialState
  )

describe('Update a task', () => {
  const fakedDate = new Date(2022, 1, 1)
  const fakedUuid = 'foobar'
  const aDate = new Date()
  const bDate = new Date()

  const task1 = new TaskBuilder()
    .withId('id1')
    .withCreationDate(fakedDate)
    .withLastUpdateDate(fakedDate)
    .withMessageKey('domain.task.test')
    .withType('task-test')
    .withStatus('processing')
    .build()

  const updatedTask1 = new TaskBuilder()
    .withId(task1.id)
    .withCreationDate(fakedDate)
    .withLastUpdateDate(aDate)
    .withMessageKey('domain.task.succeeded')
    .withType('task-test')
    .withStatus('success')
    .build()

  const updatedTask2 = new TaskBuilder()
    .withId(task1.id)
    .withCreationDate(fakedDate)
    .withLastUpdateDate(bDate)
    .withMessageKey('domain.task.error')
    .withType('task-test')
    .withStatus('error')
    .build()

  const updatedTask3 = new TaskBuilder()
    .withId(fakedUuid)
    .withCreationDate(fakedDate)
    .withLastUpdateDate(aDate)
    .withMessageKey('domain.task.error')
    .withType('task-test')
    .withStatus('error')
    .build()

  const initialState: AppState = {
    task: {
      byId: OrderedMap<string, Task>().set(task1.id, task1),
      byType: OrderedMap<string, OrderedSet<string>>().set(
        task1.type,
        OrderedSet<string>([task1.id])
      )
    },
    displayedTaskIds: OrderedSet<string>([task1.id])
  }

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
    state           | updatedTask                     | expectedState                                                   | expectedEventParameters
    ${initialState} | ${[updatedTask1]}               | ${getExpectedState(initialState, [updatedTask1])}               | ${[getExpectedEventParameter('task/taskUpdated', updatedTask1, fakedDate)]}
    ${initialState} | ${[updatedTask1, updatedTask2]} | ${getExpectedState(initialState, [updatedTask1, updatedTask2])} | ${[getExpectedEventParameter('task/taskUpdated', updatedTask1, fakedDate), getExpectedEventParameter('task/taskUpdated', updatedTask2, fakedDate)]}
    ${initialState} | ${[updatedTask3]}               | ${getExpectedState(initialState, [updatedTask3], 0)}            | ${[getExpectedEventParameter('error/errorThrown', error, fakedDate)]}
  `(
    `Given that there are $updatedTask.length task(s) to update`,
    ({ state, updatedTask, expectedState, expectedEventParameters }: DeepReadonly<Data>): void => {
      const store: ReduxStore = configureStore(eventBus, state)

      describe('When updating a task', () => {
        afterAll(() => {
          jest.clearAllMocks()
        })
        test(`Then, expect state to be ${JSON.stringify(
          expectedState
        )} and eventParameters to be ${JSON.stringify(expectedEventParameters)}`, async () => {
          await updatedTask.forEach((elt: UpdateTask) => {
            store.dispatch(updateTask(elt))
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
