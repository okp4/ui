import { ConnectionStatuses, AccountsByChainId } from '../entities/wallet'
import { ConnectionError } from '../entities/errors'

export interface AppState {
  connectionStatuses: ConnectionStatuses
  accounts: AccountsByChainId
  error: ConnectionError | null
}
