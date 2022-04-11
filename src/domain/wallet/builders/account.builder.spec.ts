import type { DeepReadonly } from 'superTypes'
import { UnspecifiedError } from '../entities/errors'
import type { Account, Algorithm } from '../entities/wallet'
import { AccountBuilder } from './account.builder'

describe('Build an Account', () => {
  const buildAccount = (
    address?: string,
    publicKey?: DeepReadonly<Uint8Array>,
    algorithm?: Algorithm
  ): Account =>
    new AccountBuilder()
      .withAddress(address)
      .withPublicKey(publicKey)
      .withAlgorithm(algorithm)
      .build()

  describe.each`
    address       | pubKey               | algorithm
    ${''}         | ${new Uint8Array(1)} | ${'sr25519'}
    ${'address1'} | ${new Uint8Array(0)} | ${'sr25519'}
    ${undefined}  | ${undefined}         | ${undefined}
  `(
    'Given that address is <$address>, public key is <$pubKey> and algorithm is <$algorithm>',
    ({ address, publicKey, algorithm }: DeepReadonly<Account>): void => {
      describe('When building account', () => {
        const account = (): Account => buildAccount(address, publicKey, algorithm)
        test('Then, expect builder to throw an UnspecifiedError ', () => {
          expect(account).toThrowError(UnspecifiedError)
        })
      })
    }
  )

  describe('Given that address, publicKey and algorithm are correctly provided', () => {
    const address = 'address2'
    const pubKey = new Uint8Array(2)
    const algorithm: Algorithm = 'ed25519'
    describe('When building account', () => {
      const account = buildAccount(address, pubKey, algorithm)
      test('Then, expect builder to construct a valid Account ', () => {
        expect(account).toEqual({
          address: 'address2',
          algorithm: 'ed25519',
          publicKey: new Uint8Array(2)
        })
      })
    })
  })
})
