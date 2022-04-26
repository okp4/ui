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
