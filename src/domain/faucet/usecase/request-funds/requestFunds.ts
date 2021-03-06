import { ThrowErrorActions, TaskActions } from 'domain/common/actionCreators'
import { ErrorMapper } from 'domain/error/mapper/error.mapper'
import type { ReduxStore, ThunkResult } from 'domain/faucet/store/store'
import { TaskBuilder } from 'domain/task/builder/task/task.builder'
import { UpdateTaskBuilder } from 'domain/task/builder/updateTask/updateTask.builder'
import { checkOKP4Address } from '../../service/checkOKP4Address'

export const faucetTaskType = 'faucet#request-funds'

const createTaskFactory = (): TaskBuilder =>
  new TaskBuilder().withMessageKey('domain.task.proceeded').withType(faucetTaskType)

const dispatchRequestFundsAmendedTask = (
  dispatch: ReduxStore['dispatch'],
  taskId: string,
  hasError?: boolean
): void => {
  const updatedTask = new UpdateTaskBuilder()
    .withId(taskId)
    .withMessageKey(`domain.task.${hasError ? 'error' : 'success'}`)
    .withStatus(hasError ? 'error' : 'success')
    .build()
  dispatch(TaskActions.taskAmended(updatedTask))
}

const dispatchRequestFundsError = (
  dispatch: ReduxStore['dispatch'],
  taskId: string,
  error: unknown
): void => {
  const errorToDispatch = ErrorMapper.mapRawErrorToEntity(error)
  dispatch(ThrowErrorActions.errorThrown(errorToDispatch))
  dispatchRequestFundsAmendedTask(dispatch, taskId, true)
}

export const requestFunds =
  (address: string): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async (dispatch, _getState, { faucetGateway }) => {
    const createTask = createTaskFactory().build()
    try {
      dispatch(TaskActions.taskCreated(createTask))
      checkOKP4Address(address)
      await faucetGateway.requestFunds(address)
      dispatchRequestFundsAmendedTask(dispatch, createTask.id)
    } catch (error: unknown) {
      dispatchRequestFundsError(dispatch, createTask.id, error)
    }
  }
