/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from '../../../helpers/store.helper'
import { createAction } from '../../../helpers/store.helper'

export const SetAddressActions = {
  setAddress: (address: string) => createAction('faucet/setAddress', { address })
}

export type SetAddressActionTypes = ActionsUnion<typeof SetAddressActions>
