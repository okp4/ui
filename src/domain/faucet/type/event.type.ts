import type { DeepReadonly } from 'superTypes'
import type { ErrorFaucetActions } from '../usecase/actionCreators'
import type { RequestFundsActions } from '../usecase/request-funds/actionCreators'
import type { SetAddressActions } from '../usecase/set-address/actionCreators'

export type FaucetFailedEvent = DeepReadonly<ReturnType<typeof ErrorFaucetActions['faucetFailed']>>
export type FaucetAddressSetEvent = DeepReadonly<ReturnType<typeof SetAddressActions['addressSet']>>
export type RequestFundsFailedEvent = DeepReadonly<
  ReturnType<typeof RequestFundsActions['requestFundsFailed']>
>
export type RequestFundsProceededEvent = DeepReadonly<
  ReturnType<typeof RequestFundsActions['requestFundsProceeded']>
>
export type RequestFundsSucceededEvent = DeepReadonly<
  ReturnType<typeof RequestFundsActions['requestFundsSucceeded']>
>
