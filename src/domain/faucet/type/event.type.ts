import type { DeepReadonly } from 'superTypes'
import type { SetAddressActions } from '../usecase/set-address/actionCreators'

export type FaucetAddressSetEvent = DeepReadonly<ReturnType<typeof SetAddressActions['addressSet']>>
