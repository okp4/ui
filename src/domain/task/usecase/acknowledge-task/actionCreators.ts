/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'

export const AcknowledgeTaskActions = {
  taskAcknowledged: (id: string) => createAction('task/taskAcknowledged', id)
}

export type AcknowledgeTaskActionTypes = ActionsUnion<typeof AcknowledgeTaskActions>
