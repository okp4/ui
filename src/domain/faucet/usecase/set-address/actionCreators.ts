/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from '../../../helpers/store.helper'
import { createAction } from '../../../helpers/store.helper'

export const SetAddressActions = {
  addressSet: (address: string) => createAction('faucet/addressSet', { address })
}

export type SetAddressActionTypes = ActionsUnion<typeof SetAddressActions>
