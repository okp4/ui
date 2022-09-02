import { OrderedMap, OrderedSet } from 'immutable'
import short from 'short-uuid'
import { EventBus } from 'ts-bus'
import type { ReduxStore } from '../../store/store'
import { amendTaskStatus } from './amendTaskStatus'
import { ErrorBuilder } from 'domain/error/builder/error.builder'
import type { Task } from 'domain/task/entity/task'
import type { AppState } from 'domain/task/store/appState'
import type { DeepReadonly } from 'superTypes'
import { TaskBuilder } from 'domain/task/builder/task.builder'
import { EventParameter, expectEventParameters } from '../../helper/test.helper'
import { getExpectedEventParameter } from '../../helper/test.helper'
import { TaskStoreBuilder } from 'domain/task/store/builder/store.builder'
import { AmendTaskStatus } from 'domain/task/command/amendTaskStatus'
import { TaskStatusAmendedPayload } from 'domain/task/event/taskStatusAmended'

type InitialProps = Readonly<{
  store: ReduxStore
}>

type Data = {
  taskStatusesToAmend: AmendTaskStatus[]
  expectedState: AppState
  expectedEventParameters: EventParameter<TaskStatusAmendedPayload>[]
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

const getExpectedState = (
  iniialState: DeepReadonly<AppState>,
  tasks: DeepReadonly<Task[]>,
  errorIndex?: number
): AppState =>
  tasks.reduce<AppState>((acc: DeepReadonly<AppState>, cur: Task, index: number): AppState => {
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
  }, iniialState)

describe('Amend the status property of a task', () => {
  const fakedDate = new Date('2021-01-01T09:00:00.000Z')
  const fakedUuid = 'foobar'
  const aDate = new Date()
  const bDate = new Date()
  const initiator = 'domain:task'

  // Commands
  const taskStatusToAmend1: AmendTaskStatus = {
    id: 'id1',
    timestamp: aDate,
    status: 'success'
  }

  const taskStatusToAmend2: AmendTaskStatus = {
    id: 'id1',
    timestamp: bDate,
    status: 'processing'
  }

  const taskStatusToAmend3: AmendTaskStatus = {
    id: fakedUuid,
    timestamp: aDate,
    status: 'error'
  }

  // Event payloads
  const taskStatusAmendedPayload1: TaskStatusAmendedPayload = {
    id: taskStatusToAmend1.id,
    timestamp: taskStatusToAmend1.timestamp as Date,
    status: taskStatusToAmend1.status
  }

  const taskStatusAmendedPayload2: TaskStatusAmendedPayload = {
    id: taskStatusToAmend2.id,
    timestamp: taskStatusToAmend2.timestamp as Date,
    status: taskStatusToAmend2.status
  }

  // Entities
  const initialTask = new TaskBuilder()
    .withId('id1')
    .withCreationDate(fakedDate)
    .withLastUpdateDate(fakedDate)
    .withType('task-test')
    .withStatus('processing')
    .withInitiator(initiator)
    .build()

  const task1 = new TaskBuilder()
    .withId('id1')
    .withCreationDate(fakedDate)
    .withLastUpdateDate(aDate)
    .withType('task-test')
    .withStatus('success')
    .withInitiator(initiator)
    .build()

  const task2 = new TaskBuilder()
    .withId('id1')
    .withCreationDate(fakedDate)
    .withLastUpdateDate(bDate)
    .withType('task-test')
    .withStatus('processing')
    .withInitiator(initiator)
    .build()

  const task3 = new TaskBuilder()
    .withId(fakedUuid)
    .withCreationDate(fakedDate)
    .withLastUpdateDate(aDate)
    .withType('task-test')
    .withStatus('error')
    .withInitiator(initiator)
    .build()

  const error = new ErrorBuilder()
    .withId(fakedUuid)
    .withTimestamp(fakedDate)
    .withMessageKey('domain.error.unspecified-error')
    .withType('unspecified-error')
    .build()

  // State
  const initialState: AppState = {
    task: {
      byId: OrderedMap<string, Task>().set(initialTask.id, initialTask),
      byType: OrderedMap<string, OrderedSet<string>>().set(
        initialTask.type,
        OrderedSet<string>([initialTask.id])
      )
    },
    displayedTaskIds: OrderedSet<string>([initialTask.id])
  }

  beforeAll(() => {
    short.generate = jest.fn(() => fakedUuid as short.SUUID)
  })

  describe.each`
    taskStatusesToAmend                         | expectedState                                     | expectedEventParameters
    ${[]}                                       | ${initialState}                                   | ${[]}
    ${[taskStatusToAmend1]}                     | ${getExpectedState(initialState, [task1])}        | ${[getExpectedEventParameter('task/taskStatusAmended', taskStatusAmendedPayload1, initiator, fakedDate)]}
    ${[taskStatusToAmend1, taskStatusToAmend2]} | ${getExpectedState(initialState, [task1, task2])} | ${[getExpectedEventParameter('task/taskStatusAmended', taskStatusAmendedPayload1, initiator, fakedDate), getExpectedEventParameter('task/taskStatusAmended', taskStatusAmendedPayload2, initiator, fakedDate)]}
    ${[taskStatusToAmend3]}                     | ${getExpectedState(initialState, [task3], 0)}     | ${[getExpectedEventParameter('error/errorThrown', error, initiator, fakedDate)]}
  `(
    `Given that there are $taskStatusesToAmend.length task status(es) to amend`,
    ({ taskStatusesToAmend, expectedState, expectedEventParameters }: Data): void => {
      const { store }: InitialProps = init(initialState)

      describe('When amending a task status', () => {
        afterAll(() => {
          jest.clearAllMocks()
        })
        test(`Then, expect state to be ${JSON.stringify(
          expectedState
        )} and eventParameters to be ${JSON.stringify(expectedEventParameters)}`, async () => {
          await taskStatusesToAmend.forEach((elt: AmendTaskStatus) => {
            store.dispatch(amendTaskStatus(elt))
          })
          expect(store.getState()).toStrictEqual(expectedState)
          expectEventParameters<TaskStatusAmendedPayload>(
            expectedEventParameters,
            mockedEventBusPublish
          )
        })
      })
    }
  )
})
