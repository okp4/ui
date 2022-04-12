import type { ThunkResult } from '../../store/store'
import { SetAddressActions } from './actionCreators'

export const setAddress =
  (address: string): ThunkResult<Promise<void>> =>
  // eslint-disable-next-line @typescript-eslint/typedef
  async dispatch => {
    dispatch(SetAddressActions.addressSet(address))
  }
