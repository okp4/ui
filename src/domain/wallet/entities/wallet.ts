export type ChainId = string
export type ConnectionStatus = 'connected' | 'not connected'
export type ConnectionStatuses = Record<ChainId, ConnectionStatus>
export type Account = { address: string; publicKey: Uint8Array }
export type Accounts = Array<Account>
export type AccountsByChainId = Record<ChainId, Accounts>
