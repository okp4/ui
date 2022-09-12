/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'
import type { TaskProgressBoundsConfiguredPayload } from 'domain/task/event/taskProgressBoundsConfigured'
import type { DeepReadonly } from 'superTypes'

export const ConfigureTaskProgressBoundsActions = {
  taskProgressBoundsConfigured: (payload: DeepReadonly<TaskProgressBoundsConfiguredPayload>) =>
    createAction('task/taskProgressBoundsConfigured', payload)
}

export type ConfigureTaskProgressBoundsActionTypes = ActionsUnion<
  typeof ConfigureTaskProgressBoundsActions
>
