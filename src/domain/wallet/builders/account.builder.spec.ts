import { UnspecifiedError } from '../entities/errors'
import { AccountBuilder } from './account.builder'

describe('Build an Account', () => {
  const buildAccount = (adress: string, pubKey: Uint8Array) =>
    new AccountBuilder().withAddress(adress).withPublicKey(pubKey).build()

  describe('Given that address is empty', () => {
    const address = ''
    const pubKey = new Uint8Array(1)
    describe('When building account', () => {
      const account = () => buildAccount(address, pubKey)
      test('Then, expect builder to throw an UnspecifiedError ', () => {
        expect(account).toThrowError(UnspecifiedError)
      })
    })
  })

  describe('Given that publicKey is empty', () => {
    const address = 'address1'
    const pubKey = new Uint8Array(0)
    describe('When building account', () => {
      const account = () => buildAccount(address, pubKey)
      test('Then, expect builder to throw an UnspecifiedError ', () => {
        expect(account).toThrowError(UnspecifiedError)
      })
    })
  })

  describe('Given that no adress and no publicKey are provided', () => {
    describe('When building account', () => {
      const account = () => new AccountBuilder().build()
      test('Then, expect builder to throw an UnspecifiedError ', () => {
        expect(account).toThrowError(UnspecifiedError)
      })
    })
  })

  describe('Given that address and publicKey are correctly provided', () => {
    const address = 'address2'
    const pubKey = new Uint8Array(2)
    describe('When building account', () => {
      const account = buildAccount(address, pubKey)
      test('Then, expect builder to construct a valid Account ', () => {
        expect(account).toEqual({
          address: 'address2',
          algorithm: 'secp256k1',
          publicKey: new Uint8Array(2),
        })
      })
    })
  })
})
