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

  public readonly withId = (id: string): FileBuilder => {
    if (!id.length) {
      throw new UnspecifiedError('Ooops... An Id must be provided to build a file...')
    }
    return new FileBuilder({ ...this.file, id })
  }

  public readonly withName = (name: string): FileBuilder => {
    if (!name.length) {
      throw new UnspecifiedError('Ooops... A name must be provided to build a file...')
    }
    return new FileBuilder({ ...this.file, name })
  }

  public readonly withSize = (size: number): FileBuilder => {
    if (!size) {
      throw new UnspecifiedError('Ooops... A size must be provided to build a file...')
    }
    return new FileBuilder({ ...this.file, size })
  }

  public readonly withType = (type: string): FileBuilder => {
    if (!type.length) {
      throw new UnspecifiedError('Ooops... A type must be provided to build a file...')
    }
    return new FileBuilder({ ...this.file, type })
  }

  public readonly withStream = (stream: DeepReadonly<ReadableStream>): FileBuilder => {
    if (!(stream instanceof ReadableStream)) {
      throw new UnspecifiedError('Ooops... A stream must be provided to build a file...')
    }
    return new FileBuilder({ ...this.file, stream })
  }

  public readonly build = (): FileEntity => {
    if (this.buildInvariant()) {
      return this.file as FileEntity
    }
    throw new UnspecifiedError()
  }

  private readonly idInvariant = (): boolean => !!this.file.id && this.file.id.length > 0

  private readonly nameInvariant = (): boolean => !!this.file.name && this.file.name.length > 0

  private readonly sizeInvariant = (): boolean => !!this.file.size && this.file.size > 0

  private readonly streamInvariant = (): boolean =>
    !!this.file.stream && this.file.stream instanceof ReadableStream

  private readonly typeInvariant = (): boolean => !!this.file.type && this.file.type.length > 0

  private readonly buildInvariant = (): boolean =>
    this.idInvariant() &&
    this.nameInvariant() &&
    this.sizeInvariant() &&
    this.streamInvariant() &&
    this.typeInvariant()
}
