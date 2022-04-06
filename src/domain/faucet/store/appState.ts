export interface AppState {
  readonly status: FaucetStatus
  readonly error: Error | null
}

export type FaucetStatus = 'idle' | 'processing' | 'success' | 'error'
