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

export class KeplrExtentionNoAvailableError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'KeplrExtentionNoAvailableError'
  }
}

export class ChainSuggestionError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'ChainSuggestionError'
  }
}
