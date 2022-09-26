/* eslint-disable @typescript-eslint/no-unused-vars */
import { UnspecifiedError, UploadError } from 'domain/file/entity/error'
import type {
  FileExecutor,
  FilePort,
  FilePortId,
  FileProgressHandler,
  FileToUpload
} from 'domain/file/port/filePort'
import type { DeepReadonly } from 'superTypes'

export class InMemoryFileGateway implements FilePort {
  private _hasUploadError: boolean = false
  private _hasUnspecifiedError: boolean = false

  public readonly id = (): FilePortId => 'in-memory'

  public readonly execute = async (handler: FileExecutor): Promise<void> => handler(this)

  public readonly upload = async (
    _file: DeepReadonly<FileToUpload>,
    _target: string,
    onProgressChange?: FileProgressHandler
  ): Promise<void> => {
    if (this._hasUploadError) throw new UploadError()
    if (this._hasUnspecifiedError) throw new UnspecifiedError()
    onProgressChange?.(5)
    return Promise.resolve()
  }

  public readonly setUploadError = (): void => {
    this._hasUploadError = true
  }

  public readonly setUnspecifiedError = (): void => {
    this._hasUnspecifiedError = true
  }
}
