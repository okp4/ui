/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'

export const ClearFilections = {
  fileCleared: (id: string) => createAction('file/fileCleared', id)
}

export type ClearFileActionTypes = ActionsUnion<typeof ClearFilections>
