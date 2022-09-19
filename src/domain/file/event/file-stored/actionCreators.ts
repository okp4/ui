/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'
import type { DeepReadonly } from 'superTypes'
import type { FileStoredPayload } from './fileStored'

export const StoreFileActions = {
  fileStored: (payload: DeepReadonly<FileStoredPayload>) => createAction('file/fileStored', payload)
}

export type StoreFileActionTypes = ActionsUnion<typeof StoreFileActions>
