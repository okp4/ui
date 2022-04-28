export class ValidationError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'ValidationError'
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
