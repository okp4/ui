import type { Account, Algorithm } from '../entities/wallet'
import type { DeepReadonly } from '../../../superTypes'
import { UnspecifiedError } from '../entities/errors'

export class AccountBuilder {
  private readonly account: Account

  constructor(account?: DeepReadonly<Account>) {
    if (account) {
      this.account = account
    } else {
      this.account = {
        address: '',
        algorithm: 'secp256k1',
        publicKey: new Uint8Array()
      }
    }
  }

  public withAddress(address?: string): AccountBuilder {
    if (!address) {
      return this
    }
    if (!address.length) {
      throw new UnspecifiedError()
    }
    return new AccountBuilder({ ...this.account, address })
  }

  public withAlgorithm(algorithm?: Algorithm): AccountBuilder {
    if (!algorithm) {
      return this
    }
    return new AccountBuilder({ ...this.account, algorithm })
  }

  public withPublicKey(publicKey?: DeepReadonly<Uint8Array>): AccountBuilder {
    if (!publicKey) {
      return this
    }
    if (!publicKey.length) {
      throw new UnspecifiedError()
    }
    return new AccountBuilder({ ...this.account, publicKey })
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
