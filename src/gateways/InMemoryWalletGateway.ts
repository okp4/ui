import { ConnectionError } from 'domain/wallet/entities/errors'
import { Accounts, ChainId } from 'domain/wallet/entities/wallet'
import { Wallet, WalletId } from 'domain/wallet/ports/walletPort'

export class InMemoryWalletGateway implements Wallet {
  private _isConnected = false
  private _isAvailable = false
  private _accounts: Map<ChainId, Accounts> = new Map()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public connect = (_chainId: string): Promise<void> => {
    if (!this.isAvailable() || !this.isConnected()) {
      throw new ConnectionError()
    }
    return Promise.resolve()
  }
  public getAccounts = (chainId: string): Promise<Accounts> => {
    if (!this.isConnected()) {
      throw new ConnectionError()
    }
    const accounts = this._accounts.get(chainId) ?? []
    return Promise.resolve(accounts)
  }

  public isAvailable = (): boolean => this._isAvailable

  public isConnected = (): boolean => this._isConnected

  public setAvailable = (available: boolean): void => {
    this._isAvailable = available
  }

  public setConnected = (connected: boolean): void => {
    this._isConnected = connected
  }

  public setAccounts = (chainId: ChainId, accounts: Accounts): void => {
    this._accounts.set(chainId, accounts)
  }

  public id = (): WalletId => 'in-memory'
}
