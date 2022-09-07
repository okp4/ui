/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'
import type { TaskStatusAmendedPayload } from 'domain/task/event/taskStatusAmended'
import type { TaskStatusAmendReceivedPayload } from 'domain/task/event/taskStatusAmendReceived'
import type { DeepReadonly } from 'superTypes'

export const AmendTaskStatusActions = {
  taskStatusAmended: (payload: DeepReadonly<TaskStatusAmendedPayload>) =>
    createAction('task/taskStatusAmended', payload),
  taskStatusAmendReceived: (payload: DeepReadonly<TaskStatusAmendReceivedPayload>) =>
    createAction('task/taskStatusAmendReceived', payload)
}

export type AmendTaskStatusActionTypes = ActionsUnion<typeof AmendTaskStatusActions>
