import { UnspecifiedError } from '../entities/errors'
import { Algorithm } from '../entities/wallet'
import { AccountBuilder } from './account.builder'

describe('Build an Account', () => {
  const buildAccount = (
    address: string,
    pubKey: Uint8Array,
    algorithm: Algorithm
  ) => {
    const builder = new AccountBuilder()

    if (address) {
      builder.withAddress(address)
    }

    if (pubKey) {
      builder.withPublicKey(pubKey)
    }

    if (algorithm) {
      builder.withAlgorithm(algorithm)
    }

    return builder.build()
  }

  describe.each`
    address       | pubKey               | algorithm
    ${''}         | ${new Uint8Array(1)} | ${'sr25519'}
    ${'address1'} | ${new Uint8Array(0)} | ${'sr25519'}
    ${undefined}  | ${undefined}         | ${undefined}
  `(
    'Given that address is <$address>, public key is <$pubKey> and algorithm is <$algorithm>',
    ({ address, pubKey, algorithm }) => {
      describe('When building account', () => {
        const account = () => buildAccount(address, pubKey, algorithm)
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
          publicKey: new Uint8Array(2),
        })
      })
    })
  })
})
