import type { DeepReadonly } from 'superTypes'

export class UnspecifiedError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'UnspecifiedError'
  }
}

export class GatewayError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'GatewayError'
  }
}

export class UploadError extends Error {
  public context: Record<string, string> | undefined = {}
  constructor(message?: string, context?: DeepReadonly<Record<string, string>>) {
    super(message)
    this.name = 'UploadError'
    this.context = context
  }
}
