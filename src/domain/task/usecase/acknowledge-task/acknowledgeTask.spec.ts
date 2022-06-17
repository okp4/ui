import { OrderedMap, OrderedSet } from 'immutable'
import { EventBus } from 'ts-bus'
import { acknowledgeTask } from './acknowledgeTask'
import type { ReduxStore } from '../../store/store'
import { TaskBuilder } from 'domain/task/builder/task/task.builder'
import type { Task } from 'domain/task/entity/task'
import type { AppState } from 'domain/task/store/appState'
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

const initialState: AppState = {
  task: {
    byId: OrderedMap<string, Task>().set(task1.id, task1).set(task2.id, task2),
    byType: OrderedMap<string, OrderedSet<string>>().set(
      'task-test',
      OrderedSet<string>([task1.id, task2.id])
    )
  },
  displayedTaskIds: OrderedSet<string>([task1.id, task2.id])
}
const eventBusInstance = new EventBus()
const store: ReduxStore = new TaskStoreBuilder()
  .withPreloadedState(initialState)
  .withEventBus(eventBusInstance)
  .build()

describe('Acknowledge a task', () => {
  it('should acknowledge a registered task by its id', async () => {
    await store.dispatch(acknowledgeTask(task1.id))
    expect(store.getState()).toEqual({
      ...initialState,
      displayedTaskIds: OrderedSet<string>([task2.id])
    })
  })
})
