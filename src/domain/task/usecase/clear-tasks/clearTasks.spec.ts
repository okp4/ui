import { OrderedSet, OrderedMap } from 'immutable'
import { EventBus } from 'ts-bus'
import { RegisterTaskActions } from '../register-task/actionCreators'
import { clearTasks } from './clearTasks'
import type { ReduxStore } from '../../store/store'
import { TaskBuilder } from 'domain/task/builder/task/task.builder'
import type { Task } from 'domain/task/entity/task'
import { TaskStoreBuilder } from 'domain/task/store/builder/store.builder'

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

const eventBusInstance = new EventBus()
const store: ReduxStore = new TaskStoreBuilder().withEventBus(eventBusInstance).build()

describe('Clear all tasks', () => {
  it('should clear all registered tasks', async () => {
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
