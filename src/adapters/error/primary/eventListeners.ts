import type { EventBus } from 'ts-bus'
import type { ErrorThrownEvent } from 'domain/common/actionCreators'
import { reportError } from 'domain/error/usecase/report-error/reportError'
import type { ReduxStore } from 'domain/error/store/store'
import type { DeepReadonly } from 'superTypes'

export const initErrorEventListeners = (
  store: DeepReadonly<ReduxStore>,
  eventBus: DeepReadonly<EventBus>
): (() => void) =>
  eventBus.subscribe('error/errorThrown', (event: DeepReadonly<ErrorThrownEvent>) => {
    store.dispatch(reportError({ ...event.payload, initiator: event.meta.initiator }))
  })
