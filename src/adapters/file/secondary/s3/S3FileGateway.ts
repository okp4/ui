import type {
  FileExecutor,
  FilePort,
  FilePortId,
  FileProgressHandler,
  FileToUpload,
  UploadFile
} from 'domain/file/port/filePort'
import type { DeepReadonly } from 'superTypes'
import type { Progress } from '@aws-sdk/lib-storage'
import { Upload } from '@aws-sdk/lib-storage'
import { UploadError } from 'domain/file/entity/error'
import type { S3Config } from './client'
import { client } from './client'

export class S3FileGateway implements FilePort {
  private readonly config: S3Config
  constructor(config: DeepReadonly<S3Config>) {
    this.config = config
  }

  public readonly id = (): FilePortId => 's3'

  public readonly execute = async (handler: FileExecutor): Promise<void> => handler(this)

  public readonly upload: UploadFile = async (
    file: DeepReadonly<FileToUpload>,
    target: string,
    onProgressChange?: FileProgressHandler
  ): Promise<void> => {
    try {
      const s3Client = client(this.config)

      const s3Upload = new Upload({
        client: s3Client,
        params: {
          Bucket: target,
          Key: file.name,
          Body: file.stream
        }
      })

      if (onProgressChange) {
        s3Upload.on('httpUploadProgress', (progress: DeepReadonly<Progress>) => {
          onProgressChange(progress.loaded)
        })
      }
      await s3Upload.done()
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Oops... We encountered an unspecified error while trying to upload files...'
      throw new UploadError(errorMessage)
    }
  }
}
