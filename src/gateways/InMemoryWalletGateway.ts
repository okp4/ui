import { ConnectionError } from 'domain/wallet/entities/errors'
import { WalletPort } from 'domain/wallet/ports/walletPort'

export class InMemoryWalletGateway implements WalletPort {
  private _isConnected = false

  public enable = (chainId: string): Promise<void | ConnectionError> => {
    if (!this.isConnected()) {
      return Promise.resolve(new ConnectionError())
    }
    return Promise.resolve()
  }

  public isConnected = (): boolean => this._isConnected

  public setConnected = (connected: boolean): void => {
    this._isConnected = connected
  }
}
