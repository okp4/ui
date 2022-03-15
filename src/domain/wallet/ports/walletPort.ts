import { ConnectionError } from '../entities/errors'
import { Accounts, ChainId } from '../entities/wallet'

export type WalletPort = {
  connect: (chainId: ChainId) => Promise<void | ConnectionError>
  isConnected: () => boolean
  getAccounts: (chainId: ChainId) => Promise<Accounts>
}
