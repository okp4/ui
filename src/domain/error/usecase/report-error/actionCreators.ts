/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { Error } from 'domain/error/entity/error'
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'

export const ReportErrorActions = {
  errorReported: (error: Error) => createAction('error/errorReported', { error })
}

export type ReportErrorActionTypes = ActionsUnion<typeof ReportErrorActions>
