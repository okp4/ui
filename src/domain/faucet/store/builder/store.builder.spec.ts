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
  }> & {
    expectedStatus: boolean
  }
>

const eventBusInstance = new EventBus()
const faucetGateway = new HTTPFaucetGateway('http://super-fake-faucet-url.network')

describe('Build a Faucet store', () => {
  describe.each`
    initialStoreParameters                                             | dependencies              | eventBus            | expectedStatus
    ${undefined}                                                       | ${{ faucetGateway }}      | ${eventBusInstance} | ${true}
    ${{ eventBus: eventBusInstance }}                                  | ${{ faucetGateway }}      | ${undefined}        | ${true}
    ${{ eventBus: eventBusInstance, dependencies: { faucetGateway } }} | ${undefined}              | ${undefined}        | ${true}
    ${{ dependencies: { faucetGateway } }}                             | ${undefined}              | ${eventBusInstance} | ${true}
    ${undefined}                                                       | ${undefined}              | ${eventBusInstance} | ${false}
    ${undefined}                                                       | ${undefined}              | ${{}}               | ${false}
    ${undefined}                                                       | ${{ foo: faucetGateway }} | ${eventBusInstance} | ${false}
    ${undefined}                                                       | ${{ faucetGateway }}      | ${undefined}        | ${false}
    ${undefined}                                                       | ${undefined}              | ${undefined}        | ${false}
    ${{ eventBus: {} }}                                                | ${undefined}              | ${undefined}        | ${false}
    ${{ dependencies: {} }}                                            | ${undefined}              | ${undefined}        | ${false}
    ${{ dependencies: { foo: faucetGateway } }}                        | ${undefined}              | ${undefined}        | ${false}
  `(
    'Given that dependencies are <$dependencies> and eventBus is <$eventBus>',
    ({ initialStoreParameters, dependencies, eventBus, expectedStatus }: Data) => {
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
