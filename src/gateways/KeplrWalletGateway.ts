import { ConnectionError } from 'domain/wallet/entities/errors'
import { Wallet, WalletId } from 'domain/wallet/ports/walletPort'
import { Account, Accounts, ChainId } from 'domain/wallet/entities/wallet'
import { KeplrAccountMapper } from './mappers/account.mapper'

export class KeplrWallet implements Wallet {
  public isConnected = (): boolean =>
    !!window.Keplr.getOfflineSigner && !!window.Keplr

  public connect = (chainId: ChainId): Promise<void | ConnectionError> => {
    if (!this.isConnected) {
      return Promise.resolve(new ConnectionError())
    }
    return window.Keplr.enable(chainId)
  }

  public getAccounts = async (chainId: ChainId): Promise<Accounts> => {
    const offlineSigner = window.Keplr.getOfflineSigner(chainId)
    const accounts = await offlineSigner.getAccounts()
    return accounts.map(
      (account): Account => KeplrAccountMapper.mapAccount(account)
    )
  }

  public id = (): WalletId => 'keplr'
}
