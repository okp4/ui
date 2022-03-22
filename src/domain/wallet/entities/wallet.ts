import type { Map, List } from 'immutable'

export type ChainId = string
export type ConnectionStatus = 'connected' | 'not connected'
export type ConnectionStatuses = Map<ChainId, ConnectionStatus>

export type Algorithm = 'secp256k1' | 'ed25519' | 'sr25519'
export type Account = {
  readonly address: string
  readonly algorithm: Algorithm
  readonly publicKey: Uint8Array
}
export type Accounts = List<Account>
export type AccountsByChainId = Map<ChainId, Accounts>
