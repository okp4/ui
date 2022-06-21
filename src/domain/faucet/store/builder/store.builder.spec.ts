import type { Store, AnyAction } from 'redux'
import { EventBus } from 'ts-bus'
import { HTTPFaucetGateway } from 'adapters/faucet/secondary/graphql/HTTPFaucetGateway'
import { UnspecifiedError } from 'domain/faucet/entity/error'
import { FaucetStoreBuilder } from './store.builder'
import type { FaucetStoreParameters } from './store.builder'
import type { AppState } from '../appState'
import { Dependencies } from '../store'

type Data = Readonly<
  Partial<{
    initialStoreParameters: FaucetStoreParameters
    dependencies: Dependencies
    eventBus: EventBus
    preloadedState: AppState
  }> & {
    expectedStatus: boolean
  }
>

const eventBusInstance = new EventBus()
const faucetGateway = new HTTPFaucetGateway('http://super-fake-faucet-url.network')
const state: AppState = {
  address: '1234567890000'
}

describe('Build a Faucet store', () => {
  describe.each`
    initialStoreParameters                                             | dependencies              | eventBus            | preloadedState | expectedStatus
    ${undefined}                                                       | ${{ faucetGateway }}      | ${eventBusInstance} | ${state}       | ${true}
    ${{ eventBus: eventBusInstance }}                                  | ${{ faucetGateway }}      | ${undefined}        | ${undefined}   | ${true}
    ${{ eventBus: eventBusInstance, dependencies: { faucetGateway } }} | ${undefined}              | ${undefined}        | ${undefined}   | ${true}
    ${{ dependencies: { faucetGateway } }}                             | ${undefined}              | ${eventBusInstance} | ${undefined}   | ${true}
    ${undefined}                                                       | ${undefined}              | ${eventBusInstance} | ${undefined}   | ${false}
    ${undefined}                                                       | ${undefined}              | ${{}}               | ${undefined}   | ${false}
    ${undefined}                                                       | ${{ foo: faucetGateway }} | ${eventBusInstance} | ${undefined}   | ${false}
    ${undefined}                                                       | ${{ faucetGateway }}      | ${undefined}        | ${undefined}   | ${false}
    ${undefined}                                                       | ${undefined}              | ${undefined}        | ${undefined}   | ${false}
    ${undefined}                                                       | ${undefined}              | ${undefined}        | ${{}}          | ${false}
    ${{ preloadedState: {} }}                                          | ${undefined}              | ${undefined}        | ${undefined}   | ${false}
    ${{ eventBus: {} }}                                                | ${undefined}              | ${undefined}        | ${undefined}   | ${false}
    ${{ dependencies: {} }}                                            | ${undefined}              | ${undefined}        | ${undefined}   | ${false}
    ${{ dependencies: { foo: faucetGateway } }}                        | ${undefined}              | ${undefined}        | ${undefined}   | ${false}
  `(
    'Given that dependencies are <$dependencies>, preloadedState is <$preloadedState> and eventBus is <$eventBus>',
    ({ initialStoreParameters, dependencies, eventBus, expectedStatus, preloadedState }: Data) => {
      describe('When building a Faucet Store', () => {
        const store = (): Store<AppState, AnyAction> => {
          // eslint-disable-next-line functional/no-let
          let faucetStoreBuilder = new FaucetStoreBuilder(initialStoreParameters)

          if (dependencies !== undefined) {
            faucetStoreBuilder = faucetStoreBuilder.withDependencies(dependencies)
          }
          if (eventBus !== undefined) {
            faucetStoreBuilder = faucetStoreBuilder.withEventBus(eventBus)
          }
          if (preloadedState !== undefined) {
            faucetStoreBuilder = faucetStoreBuilder.withPreloadedState(preloadedState)
          }
          return faucetStoreBuilder.build()
        }

        test(`Then, expect FaucetStoreBuilder to ${expectedStatus ? 'succeed' : 'fail'}`, () => {
          if (expectedStatus) {
            expect(store()).toBeDefined()
            expect(store()).toHaveProperty('dispatch')
            if (preloadedState) {
              expect(store().getState()).toStrictEqual(state)
            }
          } else {
            expect(store).toThrowError(UnspecifiedError)
          }
        })
      })
    }
  )
})
