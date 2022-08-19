import short from 'short-uuid'
import type { DeepReadonly } from 'superTypes'
import { UnspecifiedError } from '../entity/error'
import type { FileEntity } from '../entity/file'

export class FileBuilder {
  private readonly file: Partial<FileEntity>

  constructor(file?: DeepReadonly<Partial<FileEntity>>) {
    if (file) {
      this.file = file
    } else {
      this.file = {
        id: short.generate()
      }
    }
  }

  public withId(id: string): FileBuilder {
    if (!id.length) {
      throw new UnspecifiedError('Ooops... An Id must be provided to build a file...')
    }
    return new FileBuilder({ ...this.file, id })
  }

  public withName(name: string): FileBuilder {
    if (!name.length) {
      throw new UnspecifiedError('Ooops... A name must be provided to build a file...')
    }
    return new FileBuilder({ ...this.file, name })
  }

  public withSize(size: number): FileBuilder {
    if (!size) {
      throw new UnspecifiedError('Ooops... A size must be provided to build a file...')
    }
    return new FileBuilder({ ...this.file, size })
  }

  public withType(type: string): FileBuilder {
    if (!type.length) {
      throw new UnspecifiedError('Ooops... A type must be provided to build a file...')
    }
    return new FileBuilder({ ...this.file, type })
  }

  public withStream(stream: DeepReadonly<ReadableStream>): FileBuilder {
    if (!(stream instanceof ReadableStream)) {
      throw new UnspecifiedError('Ooops... A stream must be provided to build a file...')
    }
    return new FileBuilder({ ...this.file, stream })
  }

  public build(): FileEntity {
    if (
      this.file.id &&
      this.file.id.length > 0 &&
      this.file.name &&
      this.file.name.length > 0 &&
      this.file.size &&
      this.file.size > 0 &&
      this.file.stream &&
      this.file.stream instanceof ReadableStream &&
      this.file.type &&
      this.file.type.length > 0
    ) {
      return this.file as FileEntity
    }
    throw new UnspecifiedError()
  }
}
