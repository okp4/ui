/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'

export const RemoveFileActions = {
  fileRemoved: (id: string) => createAction('file/fileRemoved', id)
}

export type RemoveFileActionTypes = ActionsUnion<typeof RemoveFileActions>
