export type TaskProgressValueSetPayload<I = string> = {
  readonly id: I
  readonly timestamp: Date
  readonly progressValue: number
}
