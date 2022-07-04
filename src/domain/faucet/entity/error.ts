export class FaucetGatewayError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'FaucetGatewayError'
  }
}
export class UnspecifiedError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'UnspecifiedError'
  }
}
export class Bech32Error extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'Bech32Error'
  }
}
