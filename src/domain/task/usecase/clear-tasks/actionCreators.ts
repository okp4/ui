/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'

export const ClearTasksActions = {
  tasksCleared: () => createAction('task/tasksCleared')
}

export type ClearTaskskActionTypes = ActionsUnion<typeof ClearTasksActions>
