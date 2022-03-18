import { AccountBuilder } from 'domain/wallet/builders/account.builder'
import { Account } from 'domain/wallet/entities/wallet'
import { AccountData } from 'cosmjs/launchpad'

export class KeplrAccountMapper {
  public static mapAccount = (account: AccountData): Account =>
    new AccountBuilder()
      .withAddress(account.address)
      .withAlgorithm(account.algo)
      .withPublicKey(account.pubkey)
      .build()
}
