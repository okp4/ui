import short from 'short-uuid'
import type { ReduxStore, ThunkResult } from 'domain/file/store/store'
import type { UploadFiles } from 'domain/file/command/uploadFiles'
import type { FileExecutorHandler, FilePort } from 'domain/file/port/filePort'
import type { DeepReadonly } from 'superTypes'
import type { FileEntity } from 'domain/file/entity/file'
import { ErrorMapper } from 'domain/error/mapper/error.mapper'
import { ThrowErrorActions } from 'domain/common/actionCreators'
import { UnspecifiedError, UploadError } from 'domain/file/entity/error'
import type { AppState } from 'domain/file/store/appState'
import { removeAllFiles } from '../remove-all-files/removeAllFiles'
import type { TaskRegisterReceivedPayload } from 'domain/task/event/taskRegisterReceived'
import { RegisterTaskActions } from 'domain/task/usecase/register-task/actionCreators'
import { getFilesSizeByIds } from 'domain/file/store/selector/file.selector'
import { AmendTaskStatusActions } from 'domain/task/usecase/amend-task-status/actionCreators'
import { SetTaskProgressValueActions } from 'domain/task/usecase/set-task-progress-value/actionCreators'
import { truthy } from 'utils'

const fileTaskType = 'file#upload-files'

type StoreParams = { state: AppState; dispatch: ReduxStore['dispatch'] }

const dispatchError = (error: unknown, dispatch: DeepReadonly<StoreParams['dispatch']>): void => {
  const errorToDispatch = ErrorMapper.mapRawErrorToEntity(error)
  dispatch(ThrowErrorActions.errorThrown(errorToDispatch))
  dispatch(removeAllFiles())
}

const dispatchProgressCurrentValue =
  (taskId: string, dispatch: DeepReadonly<StoreParams['dispatch']>) =>
  (value?: number): void => {
    value !== undefined &&
      dispatch(
        SetTaskProgressValueActions.taskProgressValueSetReceived({
          id: taskId,
          progressValue: value
        })
      )
  }

const executeGatewayUpload = async (
  file: FileEntity,
  target: string,
  fileGateway: FilePort,
  taskId: string,
  dispatch: DeepReadonly<StoreParams['dispatch']>
): Promise<void> => {
  try {
    await fileGateway.execute(async (handler: DeepReadonly<FileExecutorHandler>) => {
      const { id, name, size, stream, type }: FileEntity = file

      await handler.upload(
        { id, name, size, stream, type },
        target,
        dispatchProgressCurrentValue(taskId, dispatch)
      )
    })

    dispatch(AmendTaskStatusActions.taskStatusAmendReceived({ id: taskId, status: 'success' }))
  } catch (error: unknown) {
    const uploadError =
      error instanceof UploadError
        ? new UploadError(error.message, { ...error.context, taskId })
        : new UnspecifiedError(
            `Oops... An unspecified error occured when trying to execute a file upload for the task <${taskId}>`
          )
    dispatch(AmendTaskStatusActions.taskStatusAmendReceived({ id: taskId, status: 'error' }))
    throw uploadError
  }
}

const processUpload = async (
  files: DeepReadonly<FileEntity<string>[]>,
  target: string,
  fileGateway: FilePort,
  storeParams: DeepReadonly<StoreParams>
): Promise<void[]> => {
  const promises: Promise<void>[] = []
  const { state, dispatch }: StoreParams = storeParams

  files.forEach((file: FileEntity) => {
    const taskToRegister: TaskRegisterReceivedPayload = {
      id: short.generate(),
      type: fileTaskType,
      progress: {
        min: 0,
        max: getFilesSizeByIds(state, [file.id]),
        current: 0
      }
    }
    dispatch(RegisterTaskActions.taskRegisterReceived(taskToRegister))
    promises.push(executeGatewayUpload(file, target, fileGateway, taskToRegister.id, dispatch))
  })
  return Promise.all(promises)
}

/**
 * Upload files to any server.
 * @param uploadFilesPayload An object containing the id of the file gateway to use,
 * the target represented by either a root folder / bucket / etc. in which the file must be uploaded
 * on server (e.g 'MyBucketName' or '/rootFolderPath/'),
 * and optionally an array of file ids to be uploaded.
 * @return A Redux async ThunkResult.
 */
export const uploadFiles =
  (uploadFilesPayload: DeepReadonly<UploadFiles>): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async (dispatch, getState, { fileRegistryGateway }) => {
    try {
      const storeParams: StoreParams = { state: getState(), dispatch }
      const { target, filePortId, fileIds = [] }: DeepReadonly<UploadFiles> = uploadFilesPayload
      const fileEntitiesById = storeParams.state.file.byId
      const hasFileIds = fileIds.length > 0
      const fileGateway = fileRegistryGateway.get(filePortId)
      const isCommandPayloadValid = fileIds.every((fileId: string) => fileEntitiesById.has(fileId))

      if (!fileEntitiesById.size) {
        throw new UnspecifiedError(`Oops... It looks like there are no file(s) to upload...`)
      }

      if (hasFileIds && !isCommandPayloadValid) {
        throw new UnspecifiedError(
          `Oops... At least one provided file id does not exist... Check the provided list: ${JSON.stringify(
            fileIds
          )}...`
        )
      }

      if (!target.length) {
        throw new UnspecifiedError(
          `Oops... It seems that the provided target is empty... So we cannot perform a file upload...`
        )
      }

      const files = hasFileIds
        ? fileIds.map((id: string) => fileEntitiesById.get(id)).filter(truthy)
        : fileEntitiesById.toIndexedSeq().toArray()
      await processUpload(files, target, fileGateway, storeParams)
      dispatch(removeAllFiles())
    } catch (error: unknown) {
      dispatchError(error, dispatch)
    }
  }
