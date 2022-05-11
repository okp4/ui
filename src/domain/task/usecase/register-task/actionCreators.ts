/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { Task } from 'domain/task/entity/task'
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'

export const RegisterTaskActions = {
  taskRegistered: (task: Task) => createAction('task/taskRegistered', { task })
}

export type RegisterTaskActionTypes = ActionsUnion<typeof RegisterTaskActions>
