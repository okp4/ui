/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'
import type { TaskProgressValueSetPayload } from 'domain/task/event/taskProgressValueSet'
import type { DeepReadonly } from 'superTypes'

export const SetTaskProgressValueActions = {
  taskProgressValueSet: (payload: DeepReadonly<TaskProgressValueSetPayload>) =>
    createAction('task/taskProgressValueSet', payload)
}

export type SetTaskProgressValueActionTypes = ActionsUnion<typeof SetTaskProgressValueActions>
