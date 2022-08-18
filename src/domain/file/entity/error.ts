export class UnspecifiedError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'UnspecifiedError'
  }
}
