import { AccountBuilder } from 'domain/wallet/builders/account.builder'
import type { Account } from 'domain/wallet/entities/wallet'
import type { AccountData } from '@cosmjs/launchpad'
import type { DeepReadonly } from '../../../superTypes'

export class KeplrAccountMapper {
  public static readonly mapAccount = (account: DeepReadonly<AccountData>): Account =>
    new AccountBuilder()
      .withAddress(account.address)
      .withAlgorithm(account.algo)
      .withPublicKey(account.pubkey)
      .build()
}
