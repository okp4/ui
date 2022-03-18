export type ChainId = string
export type ConnectionStatus = 'connected' | 'not connected'
export type ConnectionStatuses = Record<ChainId, ConnectionStatus>

export type Algorithm = 'secp256k1' | 'ed25519' | 'sr25519'
export type Account = {
  address: string
  algorithm: Algorithm
  publicKey: Uint8Array
}
export type Accounts = Array<Account>
export type AccountsByChainId = Record<ChainId, Accounts>
