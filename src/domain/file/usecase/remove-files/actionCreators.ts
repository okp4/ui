/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'

export const RemoveFilesActions = {
  filesRemoved: () => createAction('file/filesRemoved')
}

export type RemoveFilesActionTypes = ActionsUnion<typeof RemoveFilesActions>
