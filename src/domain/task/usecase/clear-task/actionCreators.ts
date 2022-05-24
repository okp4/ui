/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'

export const ClearTaskActions = {
  taskCleared: (id: string) => createAction('task/taskCleared', id)
}

export type ClearTaskActionTypes = ActionsUnion<typeof ClearTaskActions>
