/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { UpdateTask } from 'domain/task/entity/task'
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'

export const UpdateTaskActions = {
  taskUpdated: (task: UpdateTask) => createAction('task/taskUpdated', task)
}

export type UpdateTaskActionTypes = ActionsUnion<typeof UpdateTaskActions>
