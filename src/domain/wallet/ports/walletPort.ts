import { ConnectionError, GatewayError } from '../entities/errors'
import { Accounts, ChainId } from '../entities/wallet'

export type WalletRegistryPort = {
  get: (id: WalletId) => Wallet | GatewayError
  names: () => string[]
}

export type Wallet = {
  id: () => WalletId
  isAvailable: () => boolean
  connect: (chainId: ChainId) => Promise<void | ConnectionError>
  isConnected: () => boolean
  getAccounts: (chainId: ChainId) => Promise<Accounts | ConnectionError>
}

export type WalletId = string
