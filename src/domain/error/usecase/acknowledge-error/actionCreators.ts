/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'

export const AcknowledgeErrorActions = {
  errorAcknowledged: () => createAction('error/errorAcknowledged')
}

export type AcknowledgeErrorActionTypes = ActionsUnion<typeof AcknowledgeErrorActions>
