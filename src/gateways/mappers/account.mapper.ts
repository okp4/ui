import { AccountBuilder } from 'domain/wallet/builders/account.builder'
import { Account } from 'domain/wallet/entities/wallet'
import { KeplrAccountDTO } from '../DTO/keplrDTO'

export class KeplrAccountMapper {
  public static mapAccount = (account: KeplrAccountDTO): Account =>
    new AccountBuilder()
      .withAddress(account.address)
      .withPublicKey(account.pubkey)
      .build()
}
