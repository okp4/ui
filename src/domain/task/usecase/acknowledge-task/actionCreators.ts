/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'
import type { TaskAcknowledgedPayload } from 'domain/task/event/taskAcknowledged'

export const AcknowledgeTaskActions = {
  taskAcknowledged: (id: Readonly<TaskAcknowledgedPayload>) =>
    createAction('task/taskAcknowledged', id)
}

export type AcknowledgeTaskActionTypes = ActionsUnion<typeof AcknowledgeTaskActions>
