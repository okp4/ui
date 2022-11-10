import type { EventBus } from 'ts-bus'
import { amendTaskStatus } from 'domain/task/usecase/amend-task-status/amendTaskStatus'
import { registerTask } from 'domain/task/usecase/register-task/registerTask'
import type { ReduxStore } from 'domain/task/store/store'
import type { DeepReadonly } from 'superTypes'
import type { TypedBusEvent } from 'eventBus/eventBus'
import type { RegisterTaskActions } from 'domain/task/usecase/register-task/actionCreators'
import type { AmendTaskStatusActions } from 'domain/task/usecase/amend-task-status/actionCreators'
import type { SetTaskProgressValueActions } from 'domain/task/usecase/set-task-progress-value/actionCreators'
import { setTaskProgressValue } from 'domain/task/usecase/set-task-progress-value/setTaskProgressValue'

export const initTaskEventListeners = (
  store: DeepReadonly<ReduxStore>,
  eventBus: DeepReadonly<EventBus>
): void => {
  eventBus.subscribe(
    'task/taskRegisterReceived',
    (
      event: DeepReadonly<
        TypedBusEvent<DeepReadonly<ReturnType<typeof RegisterTaskActions['taskRegisterReceived']>>>
      >
    ) => {
      store.dispatch(registerTask({ ...event.payload, initiator: event.meta.initiator }))
    }
  )
  eventBus.subscribe(
    'task/taskStatusAmendReceived',
    (
      event: DeepReadonly<
        TypedBusEvent<
          DeepReadonly<ReturnType<typeof AmendTaskStatusActions['taskStatusAmendReceived']>>
        >
      >
    ) => {
      store.dispatch(amendTaskStatus(event.payload))
    }
  )
  eventBus.subscribe(
    'task/taskProgressValueSetReceived',
    (
      event: DeepReadonly<
        TypedBusEvent<
          DeepReadonly<
            ReturnType<typeof SetTaskProgressValueActions['taskProgressValueSetReceived']>
          >
        >
      >
    ) => {
      store.dispatch(setTaskProgressValue(event.payload))
    }
  )
}
