import short from 'short-uuid'
import type { DeepReadonly } from 'superTypes'
import { UnspecifiedError } from '../entity/error'
import type { Error, Id } from '../entity/error'

export class ErrorBuilder {
  private readonly error: Error

  constructor(error?: DeepReadonly<Error>) {
    if (error) {
      this.error = error
    } else {
      this.error = {
        id: short.generate(),
        timestamp: new Date(),
        messageKey: '',
        type: '',
        context: {}
      }
    }
  }

  public withId(id: Id): ErrorBuilder {
    if (!id.length) {
      throw new UnspecifiedError('Ooops... An Id must be provided to build an error...')
    }
    return new ErrorBuilder({ ...this.error, id })
  }

  public withTimestamp(timestamp: Readonly<Date>): ErrorBuilder {
    if (!(timestamp instanceof Date)) {
      throw new UnspecifiedError('Ooops... A timestamp must be provided to build an error...')
    }
    return new ErrorBuilder({ ...this.error, timestamp })
  }

  public withMessageKey(messageKey: string): ErrorBuilder {
    if (!messageKey.length) {
      throw new UnspecifiedError('Ooops... A messageKey must be provided to build an error...')
    }
    return new ErrorBuilder({ ...this.error, messageKey })
  }

  public withType(type: string): ErrorBuilder {
    if (!type.length) {
      throw new UnspecifiedError('Ooops... A type must be provided to build an error...')
    }
    return new ErrorBuilder({ ...this.error, type })
  }

  public withContext(context?: DeepReadonly<Record<string, unknown>>): ErrorBuilder {
    if (!context) {
      return this
    }
    return new ErrorBuilder({ ...this.error, context })
  }

  public build(): Error {
    if (!this.invariant()) {
      throw new UnspecifiedError()
    }
    return this.error
  }

  private invariant(): boolean {
    return (
      this.error.id.length > 0 &&
      this.error.timestamp instanceof Date &&
      this.error.type.length > 0 &&
      this.error.messageKey.length > 0
    )
  }
}
