import type { DeepReadonly } from 'superTypes'
import type { RequestFundsActions } from '../usecase/request-funds/actionCreators'
import type { SetAddressActions } from '../usecase/set-address/actionCreators'

export type FaucetAddressSetEvent = DeepReadonly<ReturnType<typeof SetAddressActions['addressSet']>>

export type RequestFundsProceededEvent = DeepReadonly<
  ReturnType<typeof RequestFundsActions['requestFundsProceeded']>
>
export type RequestFundsSucceededEvent = DeepReadonly<
  ReturnType<typeof RequestFundsActions['requestFundsSucceeded']>
>
