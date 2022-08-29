/* eslint-disable functional/no-let */
import { TaskBuilder } from 'domain/task/builder/task/task.builder'
import type { Task, UpdateTask } from 'domain/task/entity/task'
import type { AmendTask, CreateTask } from 'domain/task/command/createTask'
import type { DeepReadonly } from 'superTypes'
import { UpdateTaskBuilder } from 'domain/task/builder/updateTask/updateTask.builder'

export class TaskMapper {
  public static readonly mapCreateTaskToEntity = (payload: DeepReadonly<CreateTask>): Task => {
    let builder = new TaskBuilder()
      .withId(payload.id)
      .withCreationDate(payload.timestamp)
      .withLastUpdateDate(payload.timestamp)
      .withMessageKey(payload.messageKey)
      .withType(payload.type)
      .withStatus(payload.status)
    if (payload.initiator) builder = builder.withInitiator(payload.initiator)
    return builder.build()
  }

  public static readonly mapAmendTaskToEntity = (payload: DeepReadonly<AmendTask>): UpdateTask => {
    let builder = new UpdateTaskBuilder().withId(payload.id).withLastUpdateDate(payload.timestamp)
    if (payload.messageKey) builder = builder.withMessageKey(payload.messageKey)
    if (payload.status) builder = builder.withStatus(payload.status)
    return builder.build()
  }
}
