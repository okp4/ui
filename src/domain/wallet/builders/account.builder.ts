import { Account } from 'domain/wallet/entities/wallet'

export class AccountBuilder {
  private readonly account: Account

  constructor() {
    this.account = {
      address: '',
      publicKey: new Uint8Array(),
    }
  }

  public withAddress(address: string): AccountBuilder {
    this.account.address = address
    return this
  }

  public withPublicKey(key: Uint8Array): AccountBuilder {
    this.account.publicKey = key
    return this
  }

  public build(): Account {
    return this.account
  }
}
