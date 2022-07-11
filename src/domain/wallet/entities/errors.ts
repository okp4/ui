export class ConnectionError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'ConnectionError'
  }
}
export class GatewayError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'GatewayError'
  }
}
export class UnspecifiedError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'UnspecifiedError'
  }
}

export class KeplrExtensionUnavailableError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'KeplrExtensionUnavailableError'
  }
}

export class ChainSuggestionError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'ChainSuggestionError'
  }
}
