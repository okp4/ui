/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'
import type { TaskRemovedPayload } from 'domain/task/event/taskRemoved'
import type { DeepReadonly } from 'superTypes'

export const RemoveTaskActions = {
  taskRemoved: (payload: DeepReadonly<TaskRemovedPayload>) =>
    createAction('task/taskRemoved', payload)
}

export type RemoveTaskActionTypes = ActionsUnion<typeof RemoveTaskActions>
