/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'
import type { TaskProgressValueSetPayload } from 'domain/task/event/taskProgressValueSet'
import type { TaskProgressValueSetReceivedPayload } from 'domain/task/event/taskProgressValueSetReceived'
import type { DeepReadonly } from 'superTypes'

export const SetTaskProgressValueActions = {
  taskProgressValueSet: (payload: DeepReadonly<TaskProgressValueSetPayload>) =>
    createAction('task/taskProgressValueSet', payload),
  taskProgressValueSetReceived: (payload: DeepReadonly<TaskProgressValueSetReceivedPayload>) =>
    createAction('task/taskProgressValueSetReceived', payload)
}

export type SetTaskProgressValueActionTypes = ActionsUnion<typeof SetTaskProgressValueActions>
