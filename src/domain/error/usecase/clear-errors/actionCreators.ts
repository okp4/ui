/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from 'domain/helpers/store.helper'
import { createAction } from 'domain/helpers/store.helper'

export const ClearErrorsActions = {
  errorsCleared: () => createAction('error/errorsCleared')
}

export type ClearErrorsActionTypes = ActionsUnion<typeof ClearErrorsActions>
