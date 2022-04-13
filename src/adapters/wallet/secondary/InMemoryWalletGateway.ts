import { Map, List } from 'immutable'
import { ConnectionError } from 'domain/wallet/entities/errors'
import type { Accounts, ChainId } from 'domain/wallet/entities/wallet'
import type { Wallet, WalletId } from 'domain/wallet/ports/walletPort'
import type { DeepReadonly } from 'superTypes'

export class InMemoryWalletGateway implements Wallet {
  private _isConnected: boolean = false
  private _isAvailable: boolean = false
  private _accounts: Map<ChainId, Accounts> = Map()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public readonly connect = async (_chainId: string): Promise<void> => {
    if (!this.isAvailable() || !this.isConnected()) {
      throw new ConnectionError()
    }
    return Promise.resolve()
  }
  public readonly getAccounts = async (chainId: string): Promise<Accounts> => {
    if (!this.isConnected()) {
      throw new ConnectionError()
    }
    const accounts = this._accounts.get(chainId) ?? List()
    return Promise.resolve(accounts)
  }

  public readonly isAvailable = (): boolean => this._isAvailable

  public readonly isConnected = (): boolean => this._isConnected

  public readonly setAvailable = (available: boolean): void => {
    this._isAvailable = available
  }

  public readonly setConnected = (connected: boolean): void => {
    this._isConnected = connected
  }

  public readonly setAccounts = (chainId: ChainId, accounts: DeepReadonly<Accounts>): void => {
    this._accounts = this._accounts.set(chainId, accounts)
  }

  public readonly id = (): WalletId => 'in-memory'
}
