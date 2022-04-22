/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from 'domain/helpers/store.helper'
import { createAction } from 'domain/helpers/store.helper'

export const AcknowledgeErrorActions = {
  errorAcknowledged: () => createAction('error/errorAcknowledged')
}

export type AcknowledgeErrorActionTypes = ActionsUnion<typeof AcknowledgeErrorActions>
