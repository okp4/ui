import { Accounts, ChainId } from '../entities/wallet'

export type WalletRegistryPort = {
  get: (id: WalletId) => Wallet
  names: () => string[]
}

export type Wallet = {
  id: () => WalletId
  isAvailable: () => boolean
  connect: (chainId: ChainId) => Promise<void>
  isConnected: () => boolean
  getAccounts: (chainId: ChainId) => Promise<Accounts>
}

export type WalletId = string
