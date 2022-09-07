export type TaskRegisterReceivedPayload<T = string, I = string> = {
  readonly id: I
  readonly type: T
}
