import { OrderedMap, OrderedSet } from 'immutable'
import short from 'short-uuid'
import { EventBus } from 'ts-bus'
import type { ReduxStore } from '../../store/store'
import { ErrorBuilder } from 'domain/error/builder/error.builder'
import type { Task } from 'domain/task/entity/task'
import type { AppState } from 'domain/task/store/appState'
import { TaskBuilder } from 'domain/task/builder/task.builder'
import { EventParameter, expectEventParameters } from '../../helper/test.helper'
import { getExpectedEventParameter } from '../../helper/test.helper'
import { TaskStoreBuilder } from 'domain/task/store/builder/store.builder'
import { ConfigureTaskProgressBounds } from 'domain/task/command/configureTaskProgressBounds'
import { TaskProgressBoundsConfiguredPayload } from 'domain/task/event/taskProgressBoundsConfigured'
import { configureTaskProgressBounds } from './configureTaskProgressBounds'

type InitialProps = Readonly<{
  store: ReduxStore
}>

type Data = {
  taskProgressBoundsToConfigure: ConfigureTaskProgressBounds[]
  preloadedState: AppState
  expectedState: AppState
  expectedEventParameters: EventParameter<TaskProgressBoundsConfiguredPayload>[]
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

describe('Configure the progress bounds of a task', () => {
  const fakedDate = new Date('2021-01-01T09:00:00.000Z')
  const fakedUuid = 'foobar'
  const initiator = 'domain:task'

  // Commands
  const taskProgressBoundsToConfigure1: ConfigureTaskProgressBounds = {
    id: 'id1',
    timestamp: fakedDate,
    progressBounds: { max: 100, min: 0 }
  }

  const taskProgressBoundsToConfigure2: ConfigureTaskProgressBounds = {
    id: 'id1',
    progressBounds: { max: 100 }
  }

  const taskProgressBoundsToConfigure3: ConfigureTaskProgressBounds = {
    id: 'id1',
    timestamp: fakedDate,
    progressBounds: { max: 100, min: 120 }
  }

  const taskProgressBoundsToConfigure4: ConfigureTaskProgressBounds = {
    id: 'id1',
    timestamp: fakedDate,
    progressBounds: { max: -100, min: 0 }
  }

  const taskProgressBoundsToConfigure5: ConfigureTaskProgressBounds = {
    id: 'id1',
    timestamp: fakedDate,
    progressBounds: { min: 200 }
  }

  const taskProgressBoundsToConfigure6: ConfigureTaskProgressBounds = {
    id: 'id1',
    timestamp: fakedDate,
    progressBounds: { max: 40 }
  }

  const taskProgressBoundsToConfigure7: ConfigureTaskProgressBounds = {
    id: fakedUuid,
    timestamp: fakedDate,
    progressBounds: { min: 40, max: 80 }
  }

  const taskProgressBoundsToConfigure8: ConfigureTaskProgressBounds = {
    id: 'id1',
    timestamp: fakedDate,
    progressBounds: {}
  }

  // Event payloads
  const taskProgressBoundsToConfigurePayload1: TaskProgressBoundsConfiguredPayload = {
    id: taskProgressBoundsToConfigure1.id,
    timestamp: taskProgressBoundsToConfigure1.timestamp as Date,
    progressBounds: taskProgressBoundsToConfigure1.progressBounds
  }

  const taskProgressBoundsToConfigurePayload2: TaskProgressBoundsConfiguredPayload = {
    id: taskProgressBoundsToConfigure2.id,
    timestamp: fakedDate,
    progressBounds: taskProgressBoundsToConfigure2.progressBounds
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
    .withId('id1')
    .withCreationDate(fakedDate)
    .withLastUpdateDate(fakedDate)
    .withType('task-test')
    .withStatus('processing')
    .withInitiator(initiator)
    .withProgress({ min: 0, max: 100, current: 50 })
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
      byId: state2.task.byId.set(taskProgressBoundsToConfigure1.id, {
        ...task1,
        progress: { ...task1.progress, ...taskProgressBoundsToConfigure1.progressBounds }
      })
    }
  }

  const state4: AppState = {
    ...state2,
    task: {
      ...state2.task,
      byId: state2.task.byId.set(taskProgressBoundsToConfigure2.id, {
        ...task1,
        progress: { ...task1.progress, ...taskProgressBoundsToConfigure2.progressBounds }
      })
    }
  }

  const state5: AppState = {
    task: {
      byId: OrderedMap<string, Task>().set(task2.id, task2),
      byType: OrderedMap<string, OrderedSet<string>>().set(
        task2.type,
        OrderedSet<string>([task2.id])
      )
    },
    displayedTaskIds: OrderedSet<string>([task2.id])
  }

  beforeAll(() => {
    short.generate = jest.fn(() => fakedUuid as short.SUUID)
  })

  describe.each`
    taskProgressBoundsToConfigure       | preloadedState | expectedState | expectedEventParameters
    ${[]}                               | ${state1}      | ${state1}     | ${[]}
    ${[taskProgressBoundsToConfigure1]} | ${state2}      | ${state3}     | ${[getExpectedEventParameter('task/taskProgressBoundsConfigured', taskProgressBoundsToConfigurePayload1, initiator, fakedDate)]}
    ${[taskProgressBoundsToConfigure2]} | ${state2}      | ${state4}     | ${[getExpectedEventParameter('task/taskProgressBoundsConfigured', taskProgressBoundsToConfigurePayload2, initiator, fakedDate)]}
    ${[taskProgressBoundsToConfigure3]} | ${state2}      | ${state2}     | ${[getExpectedEventParameter('error/errorThrown', error, initiator, fakedDate)]}
    ${[taskProgressBoundsToConfigure4]} | ${state2}      | ${state2}     | ${[getExpectedEventParameter('error/errorThrown', error, initiator, fakedDate)]}
    ${[taskProgressBoundsToConfigure5]} | ${state5}      | ${state5}     | ${[getExpectedEventParameter('error/errorThrown', error, initiator, fakedDate)]}
    ${[taskProgressBoundsToConfigure6]} | ${state5}      | ${state5}     | ${[getExpectedEventParameter('error/errorThrown', error, initiator, fakedDate)]}
    ${[taskProgressBoundsToConfigure7]} | ${state2}      | ${state2}     | ${[getExpectedEventParameter('error/errorThrown', error, initiator, fakedDate)]}
    ${[taskProgressBoundsToConfigure8]} | ${state2}      | ${state2}     | ${[]}
  `(
    `Given that there are $taskProgressBoundsToConfigure.length task progress values to set`,
    ({
      taskProgressBoundsToConfigure,
      preloadedState,
      expectedState,
      expectedEventParameters
    }: Data): void => {
      const { store }: InitialProps = init(preloadedState)

      describe('When configuring the task progress bounds', () => {
        afterAll(() => {
          jest.clearAllMocks()
        })
        test(`Then, expect state to be ${JSON.stringify(
          expectedState
        )} and eventParameters to be ${JSON.stringify(expectedEventParameters)}`, async () => {
          await taskProgressBoundsToConfigure.forEach((elt: ConfigureTaskProgressBounds) => {
            store.dispatch(configureTaskProgressBounds(elt))
          })
          expect(store.getState()).toStrictEqual(expectedState)
          expectEventParameters<TaskProgressBoundsConfiguredPayload>(
            expectedEventParameters,
            mockedEventBusPublish
          )
        })
      })
    }
  )
})
