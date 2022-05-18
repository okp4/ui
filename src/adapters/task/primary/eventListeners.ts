import type { EventBus } from 'ts-bus'
import type { TaskAmendedEvent, TaskCreatedEvent } from 'domain/common/actionCreators'
import { registerTask } from 'domain/task/usecase/register-task/registerTask'
import { updateTask } from 'domain/task/usecase/update-task/updateTask'
import type { ReduxStore } from 'domain/task/store/store'
import type { DeepReadonly } from 'superTypes'

export const initTaskEventListeners = (
  store: DeepReadonly<ReduxStore>,
  eventBus: DeepReadonly<EventBus>
): void => {
  eventBus.subscribe('task/taskCreated', (event: DeepReadonly<TaskCreatedEvent>) => {
    store.dispatch(registerTask({ ...event.payload, initiator: event.meta.initiator }))
  })
  eventBus.subscribe('task/taskAmended', (event: DeepReadonly<TaskAmendedEvent>) => {
    store.dispatch(updateTask(event.payload))
  })
}
