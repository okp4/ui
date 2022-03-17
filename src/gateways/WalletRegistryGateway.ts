import { GatewayError } from 'domain/wallet/entities/errors'
import { Wallet, WalletRegistryPort } from 'domain/wallet/ports/walletPort'

export class WalletRegistryGateway implements WalletRegistryPort {
  private wallets: Record<string, Wallet> = {}

  public get = (id: string): Wallet | GatewayError =>
    this.wallets[id] ??
    new GatewayError(
      `Ooops ... No gateway was found with this wallet id : ${id}`
    )

  public register = (...wallets: Wallet[]): void => {
    wallets.forEach((wallet) => (this.wallets[wallet.id()] = wallet))
  }

  public clear = (): void => {
    this.wallets = {}
  }

  public names = (): string[] => Object.keys(this.wallets)
}
