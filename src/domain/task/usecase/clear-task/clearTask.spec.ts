import { OrderedMap, OrderedSet } from 'immutable'
import { EventBus } from 'ts-bus'
import { RegisterTaskActions } from '../register-task/actionCreators'
import { clearTask } from './clearTask'
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

describe('Clear a task', () => {
  it('should clear a registered task by its id', async () => {
    store.dispatch(RegisterTaskActions.taskRegistered(task1))
    store.dispatch(RegisterTaskActions.taskRegistered(task2))
    await store.dispatch(clearTask(task1.id))
    expect(store.getState()).toEqual({
      task: {
        byId: OrderedMap<string, Task>().set(task2.id, task2),
        byType: OrderedMap<string, OrderedSet<string>>().set(task2.type, OrderedSet([task2.id]))
      },
      displayedTaskIds: OrderedSet<string>([task2.id])
    })
  })
})
