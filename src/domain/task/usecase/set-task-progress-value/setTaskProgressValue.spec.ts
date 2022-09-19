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
  EventParameter,
  expectEventParameters
} from 'domain/common/test.helper'
import { TaskStoreBuilder } from 'domain/task/store/builder/store.builder'
import { SetTaskProgressValue } from 'domain/task/command/setTaskProgressValue'
import { TaskProgressValueSetPayload } from 'domain/task/event/taskProgressValueSet'
import { setTaskProgressValue } from './setTaskProgressValue'

type InitialProps = Readonly<{
  store: ReduxStore
}>

type Data = {
  taskProgressValuesToSet: SetTaskProgressValue[]
  preloadedState: AppState
  expectedState: AppState
  expectedEventParameters: EventParameter<TaskProgressValueSetPayload>[]
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

describe('Set the progress (current) value of a task', () => {
  const fakedDate = new Date('2021-01-01T09:00:00.000Z')
  const fakedUuid = 'foobar'
  const initiator = 'domain:task'

  // Commands
  const taskProgressValueToSet1: SetTaskProgressValue = {
    id: 'id1',
    timestamp: fakedDate,
    progressValue: 10
  }

  const taskProgressValueToSet2: SetTaskProgressValue = {
    id: 'id1',
    timestamp: fakedDate,
    progressValue: 101
  }

  const taskProgressValueToSet3: SetTaskProgressValue = {
    id: 'id1',
    progressValue: -15
  }

  const taskProgressValueToSet4: SetTaskProgressValue = {
    id: fakedUuid,
    timestamp: fakedDate,
    progressValue: 15
  }

  const taskProgressValueToSet5: SetTaskProgressValue = {
    id: 'id1',
    timestamp: fakedDate,
    progressValue: 115
  }

  // Event payloads
  const taskProgressValueSetPayload1: TaskProgressValueSetPayload = {
    id: taskProgressValueToSet1.id,
    timestamp: taskProgressValueToSet1.timestamp as Date,
    progressValue: taskProgressValueToSet1.progressValue
  }

  // Entities
  const task1 = new TaskBuilder()
    .withId('id1')
    .withCreationDate(fakedDate)
    .withLastUpdateDate(fakedDate)
    .withType('task-test')
    .withStatus('processing')
    .withInitiator(initiator)
    .withProgress({ max: 100, min: 0 })
    .build()

  const task2 = new TaskBuilder()
    .withId('id1')
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

  // State

  const state1: AppState = {
    task: {
      byId: OrderedMap<string, Task>(),
      byType: OrderedMap<string, OrderedSet<string>>()
    },
    displayedTaskIds: OrderedSet<string>()
  }

  const state2: AppState = {
    task: {
      byId: OrderedMap<string, Task>().set(task1.id, task1),
      byType: OrderedMap<string, OrderedSet<string>>().set(
        task1.type,
        OrderedSet<string>([task1.id])
      )
    },
    displayedTaskIds: OrderedSet<string>([task1.id])
  }

  const state3: AppState = {
    ...state2,
    task: {
      ...state2.task,
      byId: state2.task.byId.set(taskProgressValueToSet1.id, {
        ...task1,
        progress: { ...task1.progress, current: taskProgressValueToSet1.progressValue }
      })
    }
  }

  const state4: AppState = {
    task: {
      byId: OrderedMap<string, Task>().set(task2.id, task2),
      byType: OrderedMap<string, OrderedSet<string>>().set(
        task2.type,
        OrderedSet<string>([task2.id])
      )
    },
    displayedTaskIds: OrderedSet<string>([task2.id])
  }

  const state5: AppState = {
    ...state4,
    task: {
      ...state4.task,
      byId: state4.task.byId.set(taskProgressValueToSet1.id, {
        ...task2,
        progress: { ...task2.progress, current: taskProgressValueToSet1.progressValue }
      })
    }
  }

  beforeAll(() => {
    short.generate = jest.fn(() => fakedUuid as short.SUUID)
  })

  describe.each`
    taskProgressValuesToSet      | preloadedState | expectedState | expectedEventParameters
    ${[]}                        | ${state1}      | ${state1}     | ${[]}
    ${[taskProgressValueToSet1]} | ${state2}      | ${state3}     | ${[getExpectedEventParameter('task/taskProgressValueSet', taskProgressValueSetPayload1, initiator, fakedDate)]}
    ${[taskProgressValueToSet2]} | ${state2}      | ${state2}     | ${[getExpectedEventParameter('error/errorThrown', error, initiator, fakedDate)]}
    ${[taskProgressValueToSet3]} | ${state2}      | ${state2}     | ${[getExpectedEventParameter('error/errorThrown', error, initiator, fakedDate)]}
    ${[taskProgressValueToSet4]} | ${state2}      | ${state2}     | ${[getExpectedEventParameter('error/errorThrown', error, initiator, fakedDate)]}
    ${[taskProgressValueToSet5]} | ${state2}      | ${state2}     | ${[getExpectedEventParameter('error/errorThrown', error, initiator, fakedDate)]}
    ${[taskProgressValueToSet1]} | ${state4}      | ${state5}     | ${[getExpectedEventParameter('task/taskProgressValueSet', taskProgressValueSetPayload1, initiator, fakedDate)]}
  `(
    `Given that there are $taskProgressValuesToSet.length task progress values to set`,
    ({
      taskProgressValuesToSet,
      preloadedState,
      expectedState,
      expectedEventParameters
    }: Data): void => {
      const { store }: InitialProps = init(preloadedState)

      describe('When setting the task progress value', () => {
        afterAll(() => {
          jest.clearAllMocks()
        })
        test(`Then, expect state to be ${JSON.stringify(
          expectedState
        )} and eventParameters to be ${JSON.stringify(expectedEventParameters)}`, async () => {
          await taskProgressValuesToSet.forEach((elt: SetTaskProgressValue) => {
            store.dispatch(setTaskProgressValue(elt))
          })
          expect(store.getState()).toStrictEqual(expectedState)
          expectEventParameters<TaskProgressValueSetPayload>(
            expectedEventParameters,
            mockedEventBusPublish
          )
        })
      })
    }
  )
})
