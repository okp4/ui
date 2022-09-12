import { OrderedMap, OrderedSet } from 'immutable'
import short from 'short-uuid'
import { EventBus } from 'ts-bus'
import type { ReduxStore } from '../../store/store'
import { registerTask } from './registerTask'
import { ErrorBuilder } from 'domain/error/builder/error.builder'
import type { Task } from 'domain/task/entity/task'
import type { AppState } from 'domain/task/store/appState'
import type { DeepReadonly } from 'superTypes'
import { TaskBuilder } from 'domain/task/builder/task.builder'
import { EventParameter, expectEventParameters } from '../../helper/test.helper'
import { getExpectedEventParameter } from '../../helper/test.helper'
import { TaskStoreBuilder } from 'domain/task/store/builder/store.builder'
import { RegisterTask } from 'domain/task/command/registerTask'
import { TaskRegisteredPayload } from 'domain/task/event/taskRegistered'
import { Progress } from 'domain/task/command/type'
import { TaskProgressBoundsConfiguredPayload } from 'domain/task/event/taskProgressBoundsConfigured'
import { TaskProgressValueSetPayload } from 'domain/task/event/taskProgressValueSet'

type InitialProps = Readonly<{
  store: ReduxStore
}>

type Data = {
  tasksToRegister: RegisterTask[]
  expectedState: AppState
  expectedEventParameters: EventParameter<TaskRegisteredPayload>[]
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
  const fakedDate = new Date('2021-01-01T09:00:00.000Z')
  const fakedUuid = 'foobar'
  const aDate = new Date()
  const initiator = 'domain:task'

  // Commands
  const taskToRegister1: RegisterTask = {
    id: 'id1',
    timestamp: aDate,
    type: 'test#register-task',
    initiator,
    progress: {
      min: 0
    }
  }

  const taskToRegister2: RegisterTask = {
    id: 'id2',
    timestamp: aDate,
    type: 'test#register-task',
    initiator
  }

  const taskToRegister3: RegisterTask = {
    id: 'id1',
    timestamp: aDate,
    type: 'test#register-task',
    initiator
  }

  const taskToRegister4: RegisterTask = {
    id: 'id4',
    timestamp: aDate,
    type: 'test#register-task',
    initiator,
    progress: {
      min: 0,
      max: 100,
      current: 30
    }
  }

  const taskToRegister5: RegisterTask = {
    id: 'id5',
    timestamp: aDate,
    type: 'test#register-task',
    initiator,
    progress: {
      min: 100,
      max: 10
    }
  }

  const taskToRegister6: RegisterTask = {
    id: 'id5',
    timestamp: aDate,
    type: 'test#register-task',
    initiator,
    progress: {
      min: 100,
      current: 90
    }
  }

  // Event payloads
  const taskRegisteredPayload1: TaskRegisteredPayload = {
    id: taskToRegister1.id,
    timestamp: taskToRegister1.timestamp as Date,
    type: taskToRegister1.type,
    status: 'processing',
    initiator
  }

  const taskRegisteredPayload2: TaskRegisteredPayload = {
    id: taskToRegister2.id,
    timestamp: taskToRegister2.timestamp as Date,
    type: taskToRegister2.type,
    status: 'processing',
    initiator
  }

  const taskRegisteredPayload3: TaskRegisteredPayload = {
    id: taskToRegister4.id,
    timestamp: taskToRegister4.timestamp as Date,
    type: taskToRegister4.type,
    status: 'processing',
    initiator
  }

  const taskProgressBoundsConfiguredPayload1: TaskProgressBoundsConfiguredPayload = {
    id: taskToRegister1.id,
    timestamp: taskToRegister1.timestamp as Date,
    progressBounds: { max: taskToRegister1.progress?.max, min: taskToRegister1.progress?.min }
  }

  const taskProgressBoundsConfiguredPayload2: TaskProgressBoundsConfiguredPayload = {
    id: taskToRegister4.id,
    timestamp: taskToRegister4.timestamp as Date,
    progressBounds: { max: taskToRegister4.progress?.max, min: taskToRegister4.progress?.min }
  }

  const taskProgressValueSetPayload1: TaskProgressValueSetPayload = {
    id: taskToRegister4.id,
    timestamp: taskToRegister4.timestamp as Date,
    progressValue: taskToRegister4.progress?.current as number
  }

  // Entities
  const task1 = new TaskBuilder()
    .withId(taskToRegister1.id)
    .withCreationDate(taskToRegister1.timestamp as Date)
    .withLastUpdateDate(taskToRegister1.timestamp as Date)
    .withType(taskToRegister1.type)
    .withStatus('processing')
    .withInitiator(initiator)
    .withProgress({ min: 0 })
    .build()

  const task2 = new TaskBuilder()
    .withId(taskToRegister2.id)
    .withCreationDate(taskToRegister2.timestamp as Date)
    .withLastUpdateDate(taskToRegister2.timestamp as Date)
    .withType(taskToRegister2.type)
    .withStatus('processing')
    .withInitiator(initiator)
    .build()

  const task3 = new TaskBuilder()
    .withId(taskToRegister3.id)
    .withCreationDate(taskToRegister3.timestamp as Date)
    .withLastUpdateDate(taskToRegister3.timestamp as Date)
    .withType(taskToRegister3.type)
    .withStatus('processing')
    .withInitiator(initiator)
    .build()

  const task4 = new TaskBuilder()
    .withId(taskToRegister4.id)
    .withCreationDate(taskToRegister4.timestamp as Date)
    .withLastUpdateDate(taskToRegister4.timestamp as Date)
    .withType(taskToRegister4.type)
    .withStatus('processing')
    .withInitiator(initiator)
    .withProgress(taskToRegister4.progress as Progress)
    .build()

  const error = new ErrorBuilder()
    .withId(fakedUuid)
    .withTimestamp(fakedDate)
    .withMessageKey('domain.error.unspecified-error')
    .withType('unspecified-error')
    .build()

  beforeAll(() => {
    short.generate = jest.fn(() => fakedUuid as short.SUUID)
  })

  describe.each`
    tasksToRegister                                        | expectedState                                 | expectedEventParameters
    ${[]}                                                  | ${getExpectedState([])}                       | ${[]}
    ${[taskToRegister1]}                                   | ${getExpectedState([task1])}                  | ${[getExpectedEventParameter('task/taskRegistered', taskRegisteredPayload1, initiator, fakedDate), getExpectedEventParameter('task/taskProgressBoundsConfigured', taskProgressBoundsConfiguredPayload1, initiator, fakedDate)]}
    ${[taskToRegister1, taskToRegister2]}                  | ${getExpectedState([task1, task2])}           | ${[getExpectedEventParameter('task/taskRegistered', taskRegisteredPayload1, initiator, fakedDate), getExpectedEventParameter('task/taskProgressBoundsConfigured', taskProgressBoundsConfiguredPayload1, initiator, fakedDate), getExpectedEventParameter('task/taskRegistered', taskRegisteredPayload2, initiator, fakedDate)]}
    ${[taskToRegister1, taskToRegister2, taskToRegister3]} | ${getExpectedState([task1, task2, task3], 2)} | ${[getExpectedEventParameter('task/taskRegistered', taskRegisteredPayload1, initiator, fakedDate), getExpectedEventParameter('task/taskProgressBoundsConfigured', taskProgressBoundsConfiguredPayload1, initiator, fakedDate), getExpectedEventParameter('task/taskRegistered', taskRegisteredPayload2, initiator, fakedDate), getExpectedEventParameter('error/errorThrown', error, initiator, fakedDate)]}
    ${[taskToRegister1, taskToRegister4]}                  | ${getExpectedState([task1, task4])}           | ${[getExpectedEventParameter('task/taskRegistered', taskRegisteredPayload1, initiator, fakedDate), getExpectedEventParameter('task/taskProgressBoundsConfigured', taskProgressBoundsConfiguredPayload1, initiator, fakedDate), getExpectedEventParameter('task/taskRegistered', taskRegisteredPayload3, initiator, fakedDate), getExpectedEventParameter('task/taskProgressBoundsConfigured', taskProgressBoundsConfiguredPayload2, initiator, fakedDate), getExpectedEventParameter('task/taskProgressValueSet', taskProgressValueSetPayload1, initiator, fakedDate)]}
    ${[taskToRegister5]}                                   | ${getExpectedState([])}                       | ${[getExpectedEventParameter('error/errorThrown', error, initiator, fakedDate)]}
    ${[taskToRegister6]}                                   | ${getExpectedState([])}                       | ${[getExpectedEventParameter('error/errorThrown', error, initiator, fakedDate)]}
  `(
    `Given that there are $tasksToRegister.length task(s) to register`,
    ({ tasksToRegister, expectedState, expectedEventParameters }: Data): void => {
      const { store }: InitialProps = init()

      describe('When registering a task', () => {
        afterAll(() => {
          jest.clearAllMocks()
        })
        test(`Then, expect state to be ${JSON.stringify(
          expectedState
        )}  and eventParameters to be ${JSON.stringify(expectedEventParameters)}`, async () => {
          await tasksToRegister.forEach((elt: RegisterTask) => {
            store.dispatch(registerTask(elt))
          })
          expect(store.getState()).toStrictEqual(expectedState)
          expectEventParameters<TaskRegisteredPayload>(
            expectedEventParameters,
            mockedEventBusPublish
          )
        })
      })
    }
  )
})
