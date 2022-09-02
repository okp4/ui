import { OrderedMap, OrderedSet } from 'immutable'
import { EventBus } from 'ts-bus'
import type { BusEvent } from 'ts-bus/types'
import type { ReduxStore } from 'domain/task/store/store'
import type { AppState } from 'domain/task/store/appState'
import type { DeepReadonly } from 'superTypes'
import { TaskBuilder } from 'domain/task/builder/task.builder'
import type { EventMetadata } from 'eventBus/eventBus'
import type { Task } from 'domain/task/entity/task'
import { TaskStoreBuilder } from 'domain/task/store/builder/store.builder'
import { TaskRegisterReceivedPayload } from 'domain/task/event/taskRegisterReceived'
import { TaskStatusAmendReceivedPayload } from 'domain/task/event/taskStatusAmendReceived'

type InitialProps = Readonly<{
  store: ReduxStore
  eventBus: EventBus
}>

type Data = DeepReadonly<{
  event: BusEvent | undefined
  expectedState: AppState
}>

const init = (preloadedState: AppState): InitialProps => {
  const eventBus = new EventBus()
  const store = new TaskStoreBuilder()
    .withEventBus(eventBus)
    .withPreloadedState(preloadedState)
    .build()
  return { store, eventBus }
}

describe('Listen to task events', () => {
  const fakedDate = new Date('2021-01-01T09:00:00.000Z')

  // Event payloads
  const taskToRegister: TaskRegisterReceivedPayload = {
    id: 'id2',
    type: 'task-test'
  }

  const taskStatusToAmend: TaskStatusAmendReceivedPayload = {
    id: 'id1',
    status: 'success'
  }

  // Entities
  const task1 = new TaskBuilder()
    .withId('id1')
    .withCreationDate(fakedDate)
    .withLastUpdateDate(fakedDate)
    .withType('task-test')
    .withStatus('processing')
    .withInitiator('domain:test')
    .build()

  const task2 = new TaskBuilder()
    .withId('id2')
    .withCreationDate(fakedDate)
    .withLastUpdateDate(fakedDate)
    .withType('task-test')
    .withStatus('processing')
    .withInitiator('domain:test')
    .build()

  const meta: EventMetadata = { initiator: 'domain:test', timestamp: new Date() }

  // States
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

  const expectedState1: AppState = {
    task: {
      byId: initialState.task.byId.set(task2.id, task2),
      byType: initialState.task.byType.set(
        task2.type,
        initialState.task.byType.get(task2.type, OrderedSet<string>()).add(task2.id)
      )
    },
    displayedTaskIds: initialState.displayedTaskIds.add(task2.id)
  }

  const expectedState2: AppState = {
    task: {
      byId: initialState.task.byId.set(task1.id, { ...task1, status: 'success' }),
      byType: initialState.task.byType.set(
        task1.type,
        initialState.task.byType.get(task1.type, OrderedSet<string>()).add(task1.id)
      )
    },
    displayedTaskIds: initialState.displayedTaskIds.add(task1.id)
  }

  describe.each`
    event                                                                   | expectedState
    ${undefined}                                                            | ${initialState}
    ${{ type: 'task/fooBar', payload: taskToRegister }}                     | ${initialState}
    ${{ type: 'task/taskRegisterReceived', payload: taskToRegister }}       | ${expectedState1}
    ${{ type: 'task/taskStatusAmendReceived', payload: taskStatusToAmend }} | ${expectedState2}
  `('Given that event is <$event>', ({ event, expectedState }: Data): void => {
    const { store, eventBus }: InitialProps = init(initialState)

    describe(`When publishing ${!event ? 'no' : `a ${event.type}`} event`, () => {
      event && eventBus.publish(event, meta)

      test(`Then, expect state to be ${expectedState}`, () => {
        expect(store.getState()).toEqual(expectedState)
      })
    })
  })
})
