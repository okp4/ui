/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'
import type { DeepReadonly } from 'superTypes'
import type { FileRemovedPayload } from './fileRemoved'

export const RemoveFileActions = {
  fileRemoved: (payload: DeepReadonly<FileRemovedPayload>) =>
    createAction('file/fileRemoved', payload)
}

export type RemoveFileActionTypes = ActionsUnion<typeof RemoveFileActions>
