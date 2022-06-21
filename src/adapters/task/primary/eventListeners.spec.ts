import { OrderedMap, OrderedSet } from 'immutable'
import { EventBus } from 'ts-bus'
import type { BusEvent } from 'ts-bus/types'
import type { ReduxStore } from 'domain/task/store/store'
import type { AppState } from 'domain/task/store/appState'
import type { DeepReadonly } from 'superTypes'
import { TaskBuilder } from 'domain/task/builder/task/task.builder'
import type { EventMetadata } from 'eventBus/eventBus'
import type { Task } from 'domain/task/entity/task'
import { UpdateTaskBuilder } from 'domain/task/builder/updateTask/updateTask.builder'
import { TaskStoreBuilder } from 'domain/task/store/builder/store.builder'

type InitialProps = Readonly<{
  store: ReduxStore
  eventBus: EventBus
}>

type Data = DeepReadonly<{
  event: BusEvent | undefined
  expectedState: AppState
}>

const aDate = new Date()
const bDate = new Date()

const task1 = new TaskBuilder()
  .withId('id1')
  .withCreationDate(aDate)
  .withLastUpdateDate(aDate)
  .withMessageKey('domain.task.processing')
  .withType('task-test')
  .withStatus('processing')
  .withInitiator('domain:test')
  .build()

const task2 = new TaskBuilder()
  .withId('id2')
  .withCreationDate(aDate)
  .withLastUpdateDate(aDate)
  .withMessageKey('domain.task.processing')
  .withType('task-test')
  .withStatus('processing')
  .withInitiator('domain:test')
  .build()

const updatedTask = new UpdateTaskBuilder()
  .withId('id1')
  .withLastUpdateDate(bDate)
  .withMessageKey('domain.task.succeeded')
  .withStatus('success')
  .build()

const meta: EventMetadata = { initiator: 'domain:test', timestamp: new Date() }
const initialState: AppState = {
  task: {
    byId: OrderedMap<string, Task>().set(task1.id, task1),
    byType: OrderedMap<string, OrderedSet<string>>().set(task1.type, OrderedSet<string>([task1.id]))
  },
  displayedTaskIds: OrderedSet<string>([task1.id])
}

const init = (): InitialProps => {
  const eventBus = new EventBus()
  const store = new TaskStoreBuilder()
    .withEventBus(eventBus)
    .withPreloadedState(initialState)
    .build()
  return { store, eventBus }
}

const getExpectedState = (
  task: DeepReadonly<AppState['task']>,
  displayedTaskIds: DeepReadonly<AppState['displayedTaskIds']>
): AppState => ({
  task,
  displayedTaskIds
})

describe.each`
  event                                                 | expectedState
  ${undefined}                                          | ${getExpectedState(initialState.task, initialState.displayedTaskIds)}
  ${{ type: 'task/fooBar', payload: task2 }}            | ${getExpectedState(initialState.task, initialState.displayedTaskIds)}
  ${{ type: 'task/taskCreated', payload: task2 }}       | ${getExpectedState({ byId: initialState.task.byId.set(task2.id, task2), byType: initialState.task.byType.set(task2.type, initialState.task.byType.get(task2.type, OrderedSet<string>()).add(task2.id)) }, initialState.displayedTaskIds.add(task2.id))}
  ${{ type: 'task/taskAmended', payload: updatedTask }} | ${getExpectedState({ byId: initialState.task.byId.set(task1.id, { ...task1, ...updatedTask }), byType: initialState.task.byType }, initialState.displayedTaskIds)}
`('Given that event is <$event>', ({ event, expectedState }: Data): void => {
  const { store, eventBus }: InitialProps = init()

  describe(`When publishing ${!event ? 'no' : `a ${event.type}`} event`, () => {
    event && eventBus.publish(event, meta)

    test(`Then, expect state to be ${expectedState}`, () => {
      expect(store.getState()).toEqual(expectedState)
    })
  })
})
