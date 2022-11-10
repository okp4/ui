import { Map } from 'immutable'
import { GatewayError } from 'domain/file/entity/error'
import type { FilePort, FileRegistryPort } from 'domain/file/port/filePort'
import type { DeepReadonly } from 'superTypes'

export class FileRegistryGateway implements FileRegistryPort {
  private fileGateways: Map<string, FilePort> = Map()

  public readonly get = (id: string): FilePort => {
    const fileGateway = this.fileGateways.get(id)
    if (!fileGateway) {
      throw new GatewayError(`Ooops ... No gateway was found with this id : ${id}`)
    }
    return fileGateway
  }

  public readonly register = (...fileGateways: DeepReadonly<FilePort[]>): void => {
    fileGateways.forEach((fileGateway: DeepReadonly<FilePort>) => {
      this.fileGateways = this.fileGateways.set(fileGateway.id(), fileGateway)
    })
  }

  public readonly clear = (): void => {
    this.fileGateways = this.fileGateways.clear()
  }

  public readonly names = (): readonly string[] => Object.keys(this.fileGateways)
}
