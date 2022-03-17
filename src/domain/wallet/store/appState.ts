import { ConnectionStatuses, AccountsByChainId } from '../entities/wallet'

export interface AppState {
  connectionStatuses: ConnectionStatuses
  accounts: AccountsByChainId
  error: Error | null
}
