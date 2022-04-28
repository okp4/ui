/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ActionsUnion } from 'domain/common/store.helper'
import { createAction } from 'domain/common/store.helper'

export const SetAddressActions = {
  addressSet: (address: string) => createAction('faucet/addressSet', { address })
}

export type SetAddressActionTypes = ActionsUnion<typeof SetAddressActions>
