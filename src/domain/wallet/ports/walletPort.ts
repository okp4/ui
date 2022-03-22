import type { Accounts, ChainId } from '../entities/wallet'

export type WalletRegistryPort = {
  readonly get: (id: WalletId) => Wallet
  readonly names: () => readonly string[]
}

export type Wallet = {
  readonly id: () => WalletId
  readonly isAvailable: () => boolean
  readonly connect: (chainId: ChainId) => Promise<void>
  readonly isConnected: () => boolean
  readonly getAccounts: (chainId: ChainId) => Promise<Accounts>
}

export type WalletId = string
