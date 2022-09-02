import short from 'short-uuid'
import { ThrowErrorActions } from 'domain/common/actionCreators'
import { ErrorMapper } from 'domain/error/mapper/error.mapper'
import type { ReduxStore, ThunkResult } from 'domain/faucet/store/store'
import type { TaskRegisterReceivedPayload } from 'domain/task/event/taskRegisterReceived'
import { checkOKP4Address } from '../../service/checkOKP4Address'
import { RegisterTaskActions } from 'domain/task/usecase/register-task/actionCreators'
import { AmendTaskStatusActions } from 'domain/task/usecase/amend-task-status/actionCreators'

export const faucetTaskType = 'faucet#request-funds'

const dispatchRequestFundsError = (
  dispatch: ReduxStore['dispatch'],
  taskId: string,
  error: unknown
): void => {
  const errorToDispatch = ErrorMapper.mapRawErrorToEntity(error)
  dispatch(ThrowErrorActions.errorThrown(errorToDispatch))
  dispatch(AmendTaskStatusActions.taskStatusAmendReceived({ id: taskId, status: 'error' }))
}

export const requestFunds =
  (address: string): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async (dispatch, _getState, { faucetGateway }) => {
    const taskToRegister: TaskRegisterReceivedPayload = {
      id: short.generate(),
      type: faucetTaskType
    }
    try {
      /**
       * The only way to communicate with the task domain.
       * TODO: replace these events by a command which will be handle by a command bus.
       * */
      dispatch(RegisterTaskActions.taskRegisterReceived(taskToRegister))
      checkOKP4Address(address)
      await faucetGateway.requestFunds(address)
      dispatch(
        AmendTaskStatusActions.taskStatusAmendReceived({ id: taskToRegister.id, status: 'success' })
      )
    } catch (error: unknown) {
      dispatchRequestFundsError(dispatch, taskToRegister.id, error)
    }
  }
