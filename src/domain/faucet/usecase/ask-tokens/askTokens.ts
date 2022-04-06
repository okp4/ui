import { UnspecifiedError } from 'domain/faucet/entity/error'
import type { ReduxStore, ThunkResult } from '../../store/store'
import { AskTokensActions } from './actionCreators'
import { checkOKP4Address } from '../../service/checkOKP4Address'

const dispatchError = (error: unknown, dispatch: ReduxStore['dispatch']): void => {
  const errorToDispatch = error instanceof Error ? error : new UnspecifiedError()
  dispatch(AskTokensActions.faucetFailed(errorToDispatch))
}

export const askTokens =
  (address: string): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async (dispatch, _getState, { faucetGateway }) => {
    try {
      checkOKP4Address(address)
      dispatch(AskTokensActions.faucetProceeded())
      await faucetGateway.askTokens(address)
      dispatch(AskTokensActions.faucetSucceed())
    } catch (error: unknown) {
      dispatchError(error, dispatch)
    }
  }
