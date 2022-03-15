import { ConnectionError } from 'domain/wallet/entities/errors'
import { WalletPort } from '../domain/wallet/ports/walletPort'
import { ChainId } from '../domain/wallet/entities/wallet'

export class KeplrWalletGateway implements WalletPort {
  public isConnected = (): boolean =>
    !!window.Keplr.getOfflineSigner && !!window.Keplr

  public enable = (chainId: ChainId): Promise<void | ConnectionError> => {
    if (!this.isConnected) {
      return Promise.resolve(new ConnectionError())
    }
    return window.Keplr.enable(chainId)
  }
}
