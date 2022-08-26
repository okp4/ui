import { TaskBuilder } from 'domain/task/builder/task/task.builder'
import type { Task } from 'domain/task/entity/task'
import type { CreateTask } from 'domain/task/command/createTask'
import type { DeepReadonly } from 'superTypes'

export class TaskMapper {
  public static readonly mapCommandPayloadToEntity = (payload: DeepReadonly<CreateTask>): Task =>
    new TaskBuilder()
      .withId(payload.id)
      .withCreationDate(payload.timestamp)
      .withLastUpdateDate(payload.timestamp)
      .withInitiator(payload.initiator)
      .withMessageKey(payload.messageKey)
      .withType(payload.type)
      .withStatus(payload.status)
      .build()
}
