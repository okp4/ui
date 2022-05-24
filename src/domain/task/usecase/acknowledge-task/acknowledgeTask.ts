import type { ThunkResult } from 'domain/task/store/store'
import { AcknowledgeTaskActions } from './actionCreators'

export const acknowledgeTask =
  (id: string): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async dispatch => {
    dispatch(AcknowledgeTaskActions.taskAcknowledged(id))
  }
