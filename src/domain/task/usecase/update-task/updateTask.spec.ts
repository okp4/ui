import { OrderedMap, OrderedSet } from 'immutable'
import short from 'short-uuid'
import { EventBus } from 'ts-bus'
import type { ReduxStore } from '../../store/store'
import { updateTask } from './updateTask'
import { ErrorBuilder } from 'domain/error/builder/error.builder'
import type { Task, TaskStatus, UpdateTask } from 'domain/task/entity/task'
import type { AppState } from 'domain/task/store/appState'
import type { DeepReadonly } from 'superTypes'
import { TaskBuilder } from 'domain/task/builder/task/task.builder'
import type { EventParameter } from '../../helper/test.helper'
import { getExpectedEventParameter } from '../../helper/test.helper'
import { UpdateTaskBuilder } from 'domain/task/builder/updateTask/updateTask.builder'
import { TaskStoreBuilder } from 'domain/task/store/builder/store.builder'
import { AmendTask } from 'domain/task/command/amendtask'

type Data = {
  state: AppState
  updatedTask: AmendTask[]
  expectedState: AppState
  expectedEventParameters: EventParameter<UpdateTask>[]
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
  const initiator = 'domain:task'

  // Command payloads

  const rawUpdateTask1: AmendTask = {
    id: 'id1',
    timestamp: aDate,
    messageKey: 'domain.task.succeeded',
    status: 'success'
  }

  const rawUpdateTask2: AmendTask = {
    id: 'id1',
    timestamp: bDate,
    messageKey: 'domain.task.processing',
    status: 'processing'
  }

  const rawUpdateTask3: AmendTask = {
    id: fakedUuid,
    timestamp: aDate,
    messageKey: 'domain.task.error',
    status: 'error'
  }

  // Entities
  const task1 = new TaskBuilder()
    .withId('id1')
    .withCreationDate(fakedDate)
    .withLastUpdateDate(fakedDate)
    .withMessageKey('domain.task.test')
    .withType('task-test')
    .withStatus('processing')
    .build()

  const updatedTask1 = new UpdateTaskBuilder()
    .withId(rawUpdateTask1.id)
    .withLastUpdateDate(rawUpdateTask1.timestamp)
    .withMessageKey(rawUpdateTask1.messageKey as string)
    .withStatus(rawUpdateTask1.status as TaskStatus)
    .build()

  const updatedTask2 = new UpdateTaskBuilder()
    .withId(rawUpdateTask2.id)
    .withLastUpdateDate(rawUpdateTask2.timestamp)
    .withMessageKey(rawUpdateTask2.messageKey as string)
    .withStatus(rawUpdateTask2.status as TaskStatus)
    .build()

  const updatedTask3 = new UpdateTaskBuilder()
    .withId(rawUpdateTask3.id)
    .withLastUpdateDate(rawUpdateTask3.timestamp)
    .withMessageKey(rawUpdateTask3.messageKey as string)
    .withStatus(rawUpdateTask3.status as TaskStatus)
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
    jest.useFakeTimers()
    jest.setSystemTime(fakedDate)
    short.generate = jest.fn(() => fakedUuid as short.SUUID)
  })
  afterAll(() => {
    jest.useRealTimers()
  })

  describe.each`
    state           | updatedTask                         | expectedState                                                   | expectedEventParameters
    ${initialState} | ${[rawUpdateTask1]}                 | ${getExpectedState(initialState, [updatedTask1])}               | ${[getExpectedEventParameter('task/taskUpdated', updatedTask1, initiator, fakedDate)]}
    ${initialState} | ${[rawUpdateTask1, rawUpdateTask2]} | ${getExpectedState(initialState, [updatedTask1, updatedTask2])} | ${[getExpectedEventParameter('task/taskUpdated', updatedTask1, initiator, fakedDate), getExpectedEventParameter('task/taskUpdated', updatedTask2, initiator, fakedDate)]}
    ${initialState} | ${[rawUpdateTask3]}                 | ${getExpectedState(initialState, [updatedTask3], 0)}            | ${[getExpectedEventParameter('error/errorThrown', error, initiator, fakedDate)]}
  `(
    `Given that there are $updatedTask.length task(s) to update`,
    ({ state, updatedTask, expectedState, expectedEventParameters }: DeepReadonly<Data>): void => {
      const store: ReduxStore = new TaskStoreBuilder()
        .withEventBus(eventBus)
        .withPreloadedState(state)
        .build()

      describe('When updating a task', () => {
        afterAll(() => {
          jest.clearAllMocks()
        })
        test(`Then, expect state to be ${JSON.stringify(
          expectedState
        )} and eventParameters to be ${JSON.stringify(expectedEventParameters)}`, async () => {
          await updatedTask.forEach((elt: AmendTask) => {
            store.dispatch(updateTask(elt))
          })
          expect(store.getState()).toStrictEqual(expectedState)
          if (expectedEventParameters.length) {
            expectedEventParameters.forEach(
              (elt: DeepReadonly<EventParameter<UpdateTask>>, index: number) => {
                const [first, second]: Readonly<EventParameter<UpdateTask>> = elt
                expect(mockedEventBusPublish).toHaveBeenNthCalledWith(index + 1, first, second)
              }
            )
          }
        })
      })
    }
  )
})
