/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'
import type { TaskRegisteredPayload } from 'domain/task/event/taskRegistered'
import type { TaskRegisterReceivedPayload } from 'domain/task/event/taskRegisterReceived'
import type { DeepReadonly } from 'superTypes'

export const RegisterTaskActions = {
  taskRegistered: (payload: DeepReadonly<TaskRegisteredPayload>) =>
    createAction('task/taskRegistered', payload),
  taskRegisterReceived: (payload: DeepReadonly<TaskRegisterReceivedPayload>) =>
    createAction('task/taskRegisterReceived', payload)
}

export type RegisterTaskActionTypes = ActionsUnion<typeof RegisterTaskActions>
