import { OrderedMap, OrderedSet } from 'immutable'
import { EventBus } from 'ts-bus'
import { acknowledgeTask } from './acknowledgeTask'
import { configureStore } from '../../store/store'
import type { ReduxStore } from '../../store/store'
import { TaskBuilder } from 'domain/task/builder/task.builder'
import type { Task } from 'domain/task/entity/task'
import type { AppState } from 'domain/task/store/appState'

const eventBus = new EventBus()
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

describe('Acknowledge a task', () => {
  it('should acknowledge a registered task by its id', async () => {
    const store: ReduxStore = configureStore(eventBus, initialState)
    await store.dispatch(acknowledgeTask(task1.id))
    expect(store.getState()).toEqual({
      ...initialState,
      displayedTaskIds: OrderedSet<string>([task2.id])
    })
  })
})
