import { Map } from 'immutable'
import { GatewayError } from '../domain/wallet/entities/errors'
import type { Wallet, WalletRegistryPort } from '../domain/wallet/ports/walletPort'

export class WalletRegistryGateway implements WalletRegistryPort {
  private wallets: Map<string, Wallet> = Map()

  public readonly get = (id: string): Wallet => {
    const wallet = this.wallets.get(id)
    if (!wallet) {
      throw new GatewayError(`Ooops ... No gateway was found with this wallet id : ${id}`)
    }
    return wallet
  }

  public readonly register = (...wallets: readonly Wallet[]): void => {
    wallets.forEach((wallet: Wallet) => {
      this.wallets = this.wallets.set(wallet.id(), wallet)
    })
  }

  public readonly clear = (): void => {
    this.wallets = this.wallets.clear()
  }

  public readonly names = (): readonly string[] => Object.keys(this.wallets)
}
