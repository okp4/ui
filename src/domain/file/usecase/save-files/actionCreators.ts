/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { FileEntity } from 'domain/file/entity/file'
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'

export const SaveFilesActions = {
  fileSaved: (file: FileEntity) => createAction('file/fileSaved', file)
}

export type SaveFilesActionTypes = ActionsUnion<typeof SaveFilesActions>
