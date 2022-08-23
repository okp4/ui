import { FileBuilder } from 'domain/file/builder/file.builder'
import type { FileEntity } from 'domain/file/entity/file'
import type { StoreFilePayload } from 'domain/file/command/storeFile'
import type { DeepReadonly } from 'superTypes'

export class FileMapper {
  public static readonly mapCommandPayloadToEntity = (
    payload: DeepReadonly<StoreFilePayload>
  ): FileEntity =>
    new FileBuilder()
      .withId(payload.id)
      .withName(payload.name)
      .withSize(payload.size)
      .withType(payload.type)
      .withStream(payload.stream)
      .build()
}
