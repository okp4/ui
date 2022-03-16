import { Wallet, WalletRegistryPort } from 'domain/wallet/ports/walletPort'

export class WalletRegistryGateway implements WalletRegistryPort {
  private wallets: Record<string, Wallet> = {}

  get = (id: string): Wallet => this.wallets[id]

  register = (...wallets: Wallet[]): void => {
    wallets.forEach((wallet) => (this.wallets[wallet.id()] = wallet))
  }

  clear = (): void => {
    this.wallets = {}
  }

  names = (): string[] => Object.keys(this.wallets)
}
