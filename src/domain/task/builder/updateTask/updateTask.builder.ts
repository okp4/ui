import type { DeepReadonly } from 'superTypes'
import { UnspecifiedError } from 'domain/task/entity/error'
import type { UpdateTask, TaskStatus } from 'domain/task/entity/task'

export class UpdateTaskBuilder {
  private readonly updateTask: UpdateTask

  constructor(updateTask?: DeepReadonly<UpdateTask>) {
    if (updateTask) {
      this.updateTask = updateTask
    } else {
      this.updateTask = {
        id: '',
        lastUpdateDate: new Date()
      }
    }
  }

  public withId(id: string): UpdateTaskBuilder {
    if (!id.length) {
      throw new UnspecifiedError('Oops... An Id must be provided to build an updateTask...')
    }
    return new UpdateTaskBuilder({ ...this.updateTask, id })
  }

  public withLastUpdateDate(lastUpdateDate: Readonly<Date>): UpdateTaskBuilder {
    if (!(lastUpdateDate instanceof Date)) {
      throw new UnspecifiedError(
        'Oops... A lastUpdateDate must be provided to build an updateTask...'
      )
    }
    return new UpdateTaskBuilder({ ...this.updateTask, lastUpdateDate })
  }

  public withMessageKey(messageKey: string): UpdateTaskBuilder {
    if (!messageKey.length) {
      throw new UnspecifiedError('Oops... A messageKey must be provided to build an updateTask...')
    }
    return new UpdateTaskBuilder({ ...this.updateTask, messageKey })
  }

  public withStatus(status: TaskStatus): UpdateTaskBuilder {
    if (!status.length) {
      throw new UnspecifiedError('Oops... A status must be provided to build an updateTask...')
    }
    return new UpdateTaskBuilder({ ...this.updateTask, status })
  }

  public build(): UpdateTask {
    if (!this.invariant()) {
      throw new UnspecifiedError()
    }
    return this.updateTask
  }

  private invariant(): boolean {
    return (
      this.updateTask.id.length > 0 &&
      this.updateTask.lastUpdateDate instanceof Date &&
      (this.updateTask.status ? this.updateTask.status.length > 0 : true) &&
      (this.updateTask.messageKey ? this.updateTask.messageKey.length > 0 : true)
    )
  }
}
