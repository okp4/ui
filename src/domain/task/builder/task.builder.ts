import short from 'short-uuid'
import type { DeepReadonly } from 'superTypes'
import { UnspecifiedError } from 'domain/task/entity/error'
import type { Task, TaskProgress, TaskStatus } from 'domain/task/entity/task'
import { progressInvariant } from 'domain/task/utils/task.utils'

export class TaskBuilder {
  private readonly task: Task

  constructor(task?: DeepReadonly<Task>) {
    if (task) {
      this.task = task
    } else {
      const timestamp = new Date()
      this.task = {
        id: short.generate(),
        creationDate: timestamp,
        lastUpdateDate: timestamp,
        type: '',
        initiator: '',
        status: 'processing'
      }
    }
  }

  public withId(id: string): TaskBuilder {
    if (!id.length) {
      throw new UnspecifiedError('Oops... An Id must be provided to build a task...')
    }
    return new TaskBuilder({ ...this.task, id })
  }

  public withCreationDate(creationDate: Readonly<Date>): TaskBuilder {
    if (!(creationDate instanceof Date)) {
      throw new UnspecifiedError('Oops... A creationDate must be provided to build a task...')
    }
    return new TaskBuilder({ ...this.task, creationDate })
  }

  public withLastUpdateDate(lastUpdateDate: Readonly<Date>): TaskBuilder {
    if (!(lastUpdateDate instanceof Date)) {
      throw new UnspecifiedError('Oops... A lastUpdateDate must be provided to build a task...')
    }
    return new TaskBuilder({ ...this.task, lastUpdateDate })
  }

  public withType(type: string): TaskBuilder {
    if (!type.length) {
      throw new UnspecifiedError('Oops... A type must be provided to build a task...')
    }
    return new TaskBuilder({ ...this.task, type })
  }

  public withStatus(status: TaskStatus): TaskBuilder {
    if (!status.length) {
      throw new UnspecifiedError('Oops... A status must be provided to build a task...')
    }
    return new TaskBuilder({ ...this.task, status })
  }

  public withInitiator(initiator: string): TaskBuilder {
    if (!initiator.length) {
      throw new UnspecifiedError('Oops... An initiator must be provided to build a task...')
    }
    return new TaskBuilder({ ...this.task, initiator })
  }

  public withProgress(progress: DeepReadonly<TaskProgress>): TaskBuilder {
    if (!progressInvariant(progress)) {
      throw new UnspecifiedError(
        'Oops... A valid progress object must be provided to build a task..'
      )
    }
    return new TaskBuilder({ ...this.task, progress })
  }

  public build(): Task {
    if (!this.invariant()) {
      throw new UnspecifiedError()
    }
    return this.task
  }

  private invariant(): boolean {
    return (
      this.task.id.length > 0 &&
      this.task.creationDate instanceof Date &&
      this.task.lastUpdateDate instanceof Date &&
      this.task.type.length > 0 &&
      this.task.status.length > 0 &&
      this.task.initiator.length > 0 &&
      (this.task.progress ? progressInvariant(this.task.progress) : true)
    )
  }
}
