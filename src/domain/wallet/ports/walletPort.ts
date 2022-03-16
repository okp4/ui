import { ConnectionError } from '../entities/errors'
import { Accounts, ChainId } from '../entities/wallet'

export type WalletRegistryPort = {
  get: (id: WalletId) => Wallet
  names: () => string[]
}

export type Wallet = {
  id: () => WalletId
  connect: (chainId: ChainId) => Promise<void | ConnectionError>
  isConnected: () => boolean
  getAccounts: (chainId: ChainId) => Promise<Accounts>
}

export type WalletId = string
