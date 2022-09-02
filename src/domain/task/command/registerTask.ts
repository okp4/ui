export type RegisterTask<T = string, I = string> = {
  readonly id: I
  readonly timestamp?: Date
  readonly type: T
  readonly initiator: string
}
