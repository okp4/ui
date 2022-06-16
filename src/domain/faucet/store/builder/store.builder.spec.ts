import type { Store, AnyAction } from 'redux'
import { UnspecifiedError } from 'domain/faucet/entity/error'
import { FaucetStoreBuilder } from './store.builder'
import type { StoreParameters } from './store.builder'
import type { AppState } from '../appState'

type Data = Readonly<
  Partial<{
    initialStoreParamters: StoreParameters
    faucetUrl: string
    initEventListeners: boolean
  }> & {
    expectedStatus: boolean
  }
>

describe('Build a Faucet store', () => {
  describe.each`
    initialStoreParamters                              | faucetUrl                                 | initEventListeners | expectedStatus
    ${undefined}                                       | ${'http://super-fake-faucet-url.network'} | ${true}            | ${true}
    ${undefined}                                       | ${'http://super-fake-faucet-url.network'} | ${false}           | ${true}
    ${{ url: 'http://super-fake-faucet-url.network' }} | ${undefined}                              | ${false}           | ${true}
    ${undefined}                                       | ${''}                                     | ${true}            | ${false}
  `(
    'Given that faucetUrl is <$faucetUrl> and initEventListeners is <$initEventListeners>',
    ({ initialStoreParamters, faucetUrl, initEventListeners, expectedStatus }: Data) => {
      describe('When building a Faucet Store', () => {
        const store = (): Store<AppState, AnyAction> => {
          // eslint-disable-next-line functional/no-let
          let faucetStoreBuilder = new FaucetStoreBuilder(initialStoreParamters)

          if (faucetUrl !== undefined) {
            faucetStoreBuilder = faucetStoreBuilder.withFaucetUrl(faucetUrl)
          }
          if (initEventListeners !== undefined) {
            faucetStoreBuilder = faucetStoreBuilder.withFaucetEventListeners(initEventListeners)
          }
          return faucetStoreBuilder.build()
        }

        test(`Then, expect FaucetStoreBuilder to ${expectedStatus ? 'succeed' : 'fail'}`, () => {
          if (expectedStatus) {
            expect(store()).toBeDefined()
            expect(store()).toHaveProperty('dispatch')
          } else {
            expect(store).toThrowError(UnspecifiedError)
          }
        })
      })
    }
  )
})
