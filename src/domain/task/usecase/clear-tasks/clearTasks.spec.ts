import { OrderedSet, OrderedMap } from 'immutable'
import { EventBus } from 'ts-bus'
import { RegisterTaskActions } from '../register-task/actionCreators'
import { clearTasks } from './clearTasks'
import { configureStore } from '../../store/store'
import type { ReduxStore } from '../../store/store'
import { TaskBuilder } from 'domain/task/builder/task/task.builder'
import type { Task } from 'domain/task/entity/task'

type InitialProps = Readonly<{
  store: ReduxStore
  eventBus: EventBus
}>

const init = (): InitialProps => {
  const eventBus = new EventBus()
  const store = configureStore(eventBus)
  return { store, eventBus }
}
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

describe('Clear all tasks', () => {
  it('should clear all registered tasks', async () => {
    const { store }: InitialProps = init()
    store.dispatch(RegisterTaskActions.taskRegistered(task1))
    store.dispatch(RegisterTaskActions.taskRegistered(task2))
    await store.dispatch(clearTasks())
    expect(store.getState()).toEqual({
      task: {
        byId: OrderedMap<string, Task>(),
        byType: OrderedMap<string, OrderedSet<string>>()
      },
      displayedTaskIds: OrderedSet<string>()
    })
  })
})
