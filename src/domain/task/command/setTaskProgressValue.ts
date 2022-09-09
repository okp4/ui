import type { Progress } from './type'

export type TaskProgressValue = Pick<Progress, 'current'>

export type SetTaskProgressValue<I = string> = {
  readonly id: I
  readonly progressValue: TaskProgressValue
}
