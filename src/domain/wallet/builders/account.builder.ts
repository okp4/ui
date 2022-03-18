import { Account, Algorithm } from 'domain/wallet/entities/wallet'
import { UnspecifiedError } from '../entities/errors'

export class AccountBuilder {
  private readonly account: Account

  constructor() {
    this.account = {
      address: '',
      algorithm: 'secp256k1',
      publicKey: new Uint8Array(),
    }
  }

  public withAddress(address: string): AccountBuilder {
    if (!address.length) {
      throw new UnspecifiedError()
    }
    this.account.address = address
    return this
  }

  public withAlgorithm(algorithm: Algorithm): AccountBuilder {
    this.account.algorithm = algorithm
    return this
  }

  public withPublicKey(key: Uint8Array): AccountBuilder {
    if (!key.length) {
      throw new UnspecifiedError()
    }
    this.account.publicKey = key
    return this
  }

  public build(): Account {
    if (!this.invariant()) {
      throw new UnspecifiedError()
    }
    return this.account
  }

  private invariant(): boolean {
    return this.account.address.length > 0 && this.account.publicKey.length > 0
  }
}
