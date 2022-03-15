import { ConnectionError } from '../entities/errors'
import { ChainId } from '../entities/wallet'

export type WalletPort = {
  enable: (chainId: ChainId) => Promise<void | ConnectionError>
  isConnected: () => boolean
}
