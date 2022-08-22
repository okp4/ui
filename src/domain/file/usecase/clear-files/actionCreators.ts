/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'

export const ClearFilesActions = {
  filesCleared: () => createAction('file/filesCleared')
}

export type ClearFilesActionTypes = ActionsUnion<typeof ClearFilesActions>
