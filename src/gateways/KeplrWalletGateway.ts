import { ConnectionError } from '../domain/wallet/entities/errors'
import type { Wallet, WalletId } from '../domain/wallet/ports/walletPort'
import type { Accounts, ChainId } from '../domain/wallet/entities/wallet'
import { KeplrAccountMapper } from './mappers/account.mapper'
import type { Keplr } from '@keplr-wallet/types'
import { List } from 'immutable'

export class KeplrWallet implements Wallet {
  private _isConnected: boolean = false

  public readonly isAvailable = (): boolean => !!window.keplr && !!window.keplr.getOfflineSigner

  public readonly isConnected = (): boolean => this._isConnected

  public readonly connect = async (chainId: ChainId): Promise<void> => {
    if (!this.isAvailable()) {
      throw new ConnectionError(`Ooops... Keplr extension is not available in window object`)
    }
    return (window.keplr as Keplr)
      .enable(chainId)
      .then(() => {
        this.setConnected(true)
      })
      .catch(() => {
        throw new ConnectionError(
          `Ooops... Keplr can't enable extension, please check provided chainId: ${chainId}`
        )
      })
  }

  public readonly getAccounts = async (chainId: ChainId): Promise<Accounts> => {
    if (this.isConnected()) {
      const offlineSigner = (window.keplr as Keplr).getOfflineSigner(chainId)
      const accounts = await offlineSigner.getAccounts()
      return List(accounts.map(KeplrAccountMapper.mapAccount))
    }
    throw new ConnectionError(
      "Oops ... Account can't be retrieved because extension is not connected..."
    )
  }

  public readonly id = (): WalletId => 'keplr'

  private readonly setConnected = (connected: boolean): void => {
    this._isConnected = connected
  }
}
