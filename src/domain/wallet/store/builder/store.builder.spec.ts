import type { Store, AnyAction } from 'redux'
import { EventBus } from 'ts-bus'
import { WalletRegistryGateway } from 'adapters/wallet/secondary/WalletRegistryGateway'
import { UnspecifiedError } from 'domain/wallet/entities/errors'
import { WalletStoreBuilder } from './store.builder'
import type { WalletStoreParameters } from './store.builder'
import type { AppState } from '../appState'
import { Dependencies } from '../store'
import { List, Map } from 'immutable'
import { Account, Accounts, ChainId, ConnectionStatus } from 'domain/wallet/entities/wallet'

type Data = Readonly<
  Partial<{
    initialStoreParameters: WalletStoreParameters
    dependencies: Dependencies
    eventBus: EventBus
    preloadedState: AppState
  }> & {
    expectedStatus: boolean
  }
>

const eventBusInstance = new EventBus()
const walletRegistryGateway = new WalletRegistryGateway()
const state: AppState = {
  connectionStatuses: Map<ChainId, ConnectionStatus>().set('#chain1', 'connected'),
  accounts: Map<ChainId, Accounts>().set(
    '#chain1',
    List<Account>([{ address: '12345', algorithm: 'ed25519', publicKey: new Uint8Array(2) }])
  )
}

describe('Build a Wallet store', () => {
  describe.each`
    initialStoreParameters                                                     | dependencies                      | eventBus            | preloadedState | expectedStatus
    ${undefined}                                                               | ${{ walletRegistryGateway }}      | ${eventBusInstance} | ${state}       | ${true}
    ${{ eventBus: eventBusInstance }}                                          | ${{ walletRegistryGateway }}      | ${undefined}        | ${undefined}   | ${true}
    ${{ eventBus: eventBusInstance, dependencies: { walletRegistryGateway } }} | ${undefined}                      | ${undefined}        | ${undefined}   | ${true}
    ${{ dependencies: { walletRegistryGateway } }}                             | ${undefined}                      | ${eventBusInstance} | ${undefined}   | ${true}
    ${undefined}                                                               | ${undefined}                      | ${eventBusInstance} | ${undefined}   | ${false}
    ${undefined}                                                               | ${undefined}                      | ${{}}               | ${undefined}   | ${false}
    ${undefined}                                                               | ${{ foo: walletRegistryGateway }} | ${eventBusInstance} | ${undefined}   | ${false}
    ${undefined}                                                               | ${{ walletRegistryGateway }}      | ${undefined}        | ${undefined}   | ${false}
    ${undefined}                                                               | ${undefined}                      | ${undefined}        | ${undefined}   | ${false}
    ${undefined}                                                               | ${undefined}                      | ${undefined}        | ${{}}          | ${false}
    ${{ preloadedState: {} }}                                                  | ${undefined}                      | ${undefined}        | ${undefined}   | ${false}
    ${{ eventBus: {} }}                                                        | ${undefined}                      | ${undefined}        | ${undefined}   | ${false}
    ${{ dependencies: {} }}                                                    | ${undefined}                      | ${undefined}        | ${undefined}   | ${false}
    ${{ dependencies: { foo: walletRegistryGateway } }}                        | ${undefined}                      | ${undefined}        | ${undefined}   | ${false}
  `(
    'Given that dependencies are <$dependencies>, preloadedState is <$preloadedState> and eventBus is <$eventBus>',
    ({ initialStoreParameters, dependencies, eventBus, expectedStatus, preloadedState }: Data) => {
      describe('When building a Wallet Store', () => {
        const store = (): Store<AppState, AnyAction> => {
          // eslint-disable-next-line functional/no-let
          let walletStoreBuilder = new WalletStoreBuilder(initialStoreParameters)

          if (dependencies !== undefined) {
            walletStoreBuilder = walletStoreBuilder.withDependencies(dependencies)
          }
          if (eventBus !== undefined) {
            walletStoreBuilder = walletStoreBuilder.withEventBus(eventBus)
          }
          if (preloadedState !== undefined) {
            walletStoreBuilder = walletStoreBuilder.withPreloadedState(preloadedState)
          }
          return walletStoreBuilder.build()
        }

        test(`Then, expect WalletStoreBuilder to ${expectedStatus ? 'succeed' : 'fail'}`, () => {
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
