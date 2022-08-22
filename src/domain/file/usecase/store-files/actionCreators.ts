/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { FileEntity } from 'domain/file/entity/file'
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'

export const StoreFilesActions = {
  fileStored: (file: FileEntity) => createAction('file/fileStored', file)
}

export type StoreFilesActionTypes = ActionsUnion<typeof StoreFilesActions>
