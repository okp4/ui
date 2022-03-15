import { ConnectionStatuses } from '../entities/wallet'
import { ConnectionError } from '../entities/errors'

export interface AppState {
  connectedStatuses: ConnectionStatuses
  error: ConnectionError | null
}
