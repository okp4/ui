import { ThrowErrorActions, TaskActions } from 'domain/common/actionCreators'
import { ErrorMapper } from 'domain/error/mapper/error.mapper'
import type { ReduxStore, ThunkResult } from 'domain/faucet/store/store'
import { TaskBuilder } from 'domain/task/builder/task/task.builder'
import { UpdateTaskBuilder } from 'domain/task/builder/updateTask/updateTask.builder'
import { checkOKP4Address } from '../../service/checkOKP4Address'

const createdTask = new TaskBuilder()
  .withMessageKey('domain.task.proceeded')
  .withType('faucet#request-funds')
  .build()

const dispatchRequestFundsAmendedTask = (
  dispatch: ReduxStore['dispatch'],
  hasError?: boolean
): void => {
  const updatedTask = new UpdateTaskBuilder()
    .withId(createdTask.id)
    .withMessageKey(`domain.task.${hasError ? 'error' : 'success'}`)
    .withStatus(hasError ? 'error' : 'success')
    .build()
  dispatch(TaskActions.taskAmended(updatedTask))
}

const dispatchRequestFundsError = (error: unknown, dispatch: ReduxStore['dispatch']): void => {
  const errorToDispatch = ErrorMapper.mapRawErrorToEntity(error)
  dispatch(ThrowErrorActions.errorThrown(errorToDispatch))
  dispatchRequestFundsAmendedTask(dispatch, true)
}

export const requestFunds =
  (address: string): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async (dispatch, _getState, { faucetGateway }) => {
    try {
      checkOKP4Address(address)
      dispatch(TaskActions.taskCreated(createdTask))
      await faucetGateway.requestFunds(address)
      dispatchRequestFundsAmendedTask(dispatch)
    } catch (error: unknown) {
      dispatchRequestFundsError(error, dispatch)
    }
  }
