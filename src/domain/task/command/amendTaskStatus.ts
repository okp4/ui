type Status = 'processing' | 'success' | 'error'

export type AmendTaskStatus<I = string> = {
  readonly id: I
  readonly timestamp?: Date
  readonly status: Status
}
