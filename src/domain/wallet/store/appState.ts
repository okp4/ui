import type { ConnectionStatuses, AccountsByChainId } from '../entities/wallet'

export interface AppState {
  readonly connectionStatuses: ConnectionStatuses
  readonly accounts: AccountsByChainId
  readonly error: Error | null
}
