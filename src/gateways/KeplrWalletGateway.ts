import { ConnectionError } from 'domain/wallet/entities/errors'
import { Wallet, WalletId } from 'domain/wallet/ports/walletPort'
import { Accounts, ChainId } from 'domain/wallet/entities/wallet'
import { KeplrAccountMapper } from './mappers/account.mapper'
import { Keplr } from '@keplr-wallet/types'

export class KeplrWallet implements Wallet {
  private _isConnected = false

  public isAvailable = (): boolean =>
    !!window.keplr && !!window.keplr.getOfflineSigner

  public isConnected = (): boolean => this._isConnected

  public connect = (chainId: ChainId): Promise<void | ConnectionError> => {
    if (!this.isAvailable()) {
      return Promise.resolve(
        new ConnectionError(
          `Ooops... Keplr extension is not available in window object`
        )
      )
    }
    return (window.keplr as Keplr)
      .enable(chainId)
      .then(() => {
        this.setConnected(true)
      })
      .catch(() =>
        Promise.resolve(
          new ConnectionError(
            `Ooops... Keplr can't enable extension, please check provided chainId: ${chainId}`
          )
        )
      )
  }

  public getAccounts = async (
    chainId: ChainId
  ): Promise<Accounts | ConnectionError> => {
    if (this.isConnected()) {
      const offlineSigner = (window.keplr as Keplr).getOfflineSigner(chainId)
      const accounts = await offlineSigner.getAccounts()
      return accounts.map(KeplrAccountMapper.mapAccount)
    }
    return Promise.resolve(
      new ConnectionError(
        "Oops ... Account can't be retrieved because extension is not connected..."
      )
    )
  }

  public id = (): WalletId => 'keplr'

  private setConnected = (connected: boolean): void => {
    this._isConnected = connected
  }
}
