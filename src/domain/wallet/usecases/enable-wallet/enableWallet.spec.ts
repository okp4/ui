import { Map, List } from 'immutable'
import { EventBus } from 'ts-bus'
import type { ReduxStore } from '../../store/store'
import { configureStore } from '../../store/store'
import type { AppState } from '../../store/appState'
import { enableWallet } from './enableWallet'
import { InMemoryWalletGateway } from 'adapters/wallet/secondary/InMemoryWalletGateway'
import type {
  ConnectionStatuses,
  Account,
  AccountsByChainId,
  ChainId
} from 'domain/wallet/entities/wallet'
import { AccountBuilder } from 'domain/wallet/builders/account.builder'
import { WalletRegistryGateway } from 'adapters/wallet/secondary/WalletRegistryGateway'
import type { DeepReadonly } from 'superTypes'

interface InitialProps {
  walletRegistryGateway: WalletRegistryGateway
  inMemoryGateway1: InMemoryWalletGateway
  store: ReduxStore
  initialState: AppState
}

interface Data {
  walletRegistryGatewayMustBeCleared: boolean
  isWalletAvailable: boolean
  isWalletConnected: boolean
  chainId: ChainId
  expectedPayloadType: string
  expectedPayloadMessageKey: string
  expectedHaveBeenCalledTimes: number
}

const eventBus = new EventBus()
const mockedEventBusPublish = jest.spyOn(eventBus, 'publish')

afterEach(() => {
  jest.clearAllMocks()
})

describe('Enable wallet', () => {
  const chainId1 = 'chainId#1'
  const chainId2 = 'chainId#2'
  const publicKey1: Uint8Array = new Uint8Array(1)
  const publicKey2: Uint8Array = new Uint8Array(1)
  const publicKey3: Uint8Array = new Uint8Array(1)
  const account1: Account = new AccountBuilder()
    .withAddress('address#1')
    .withPublicKey(publicKey1)
    .build()
  const account2: Account = new AccountBuilder()
    .withAddress('address#2')
    .withPublicKey(publicKey2)
    .build()
  const account3: Account = new AccountBuilder()
    .withAddress('address#3')
    .withPublicKey(publicKey3)
    .build()

  const init = (): InitialProps => {
    const walletRegistryGateway = new WalletRegistryGateway()
    const inMemoryGateway1 = new InMemoryWalletGateway()
    walletRegistryGateway.register(inMemoryGateway1)
    const store = configureStore({ walletRegistryGateway }, eventBus)
    const initialState = store.getState()
    return { walletRegistryGateway, inMemoryGateway1, store, initialState }
  }

  const dispatchEnableWallet = async (
    gateway: DeepReadonly<InMemoryWalletGateway>,
    chainId: string,
    store: DeepReadonly<ReduxStore>
  ): Promise<void> => {
    await store.dispatch(enableWallet(gateway.id(), chainId))
  }

  const expectEnabledWallet =
    (store: DeepReadonly<ReduxStore>, initialState: DeepReadonly<AppState>) =>
    (
      connectionStatuses: Readonly<ConnectionStatuses>,
      accounts: DeepReadonly<AccountsByChainId>
    ): void => {
      expect(store.getState()).toEqual({
        ...initialState,
        connectionStatuses,
        accounts
      })
    }

  describe.each`
    walletRegistryGatewayMustBeCleared | isWalletAvailable | isWalletConnected | chainId     | expectedPayloadType   | expectedPayloadMessageKey          | expectedHaveBeenCalledTimes
    ${true}                            | ${false}          | ${false}          | ${chainId1} | ${'gateway-error'}    | ${'domain.error.gateway-error'}    | ${1}
    ${false}                           | ${false}          | ${false}          | ${chainId1} | ${'connection-error'} | ${'domain.error.connection-error'} | ${1}
    ${false}                           | ${true}           | ${false}          | ${chainId1} | ${'connection-error'} | ${'domain.error.connection-error'} | ${1}
  `(
    'Given that chainId is <$chainId>',
    ({
      walletRegistryGatewayMustBeCleared,
      isWalletAvailable,
      isWalletConnected,
      chainId,
      expectedPayloadType,
      expectedPayloadMessageKey,
      expectedHaveBeenCalledTimes
    }: Readonly<Data>): void => {
      const { store, inMemoryGateway1, walletRegistryGateway }: InitialProps = init()
      if (walletRegistryGatewayMustBeCleared) {
        walletRegistryGateway.clear()
      } else {
        isWalletAvailable
          ? inMemoryGateway1.setAvailable(true)
          : inMemoryGateway1.setAvailable(false)
        isWalletConnected
          ? inMemoryGateway1.setConnected(true)
          : inMemoryGateway1.setConnected(false)
      }
      describe('When enabling wallet', () => {
        test('Then, expect an error event to be published', async () => {
          await dispatchEnableWallet(inMemoryGateway1, chainId, store)
          expect(mockedEventBusPublish).toHaveBeenCalledTimes(expectedHaveBeenCalledTimes)
          expect(mockedEventBusPublish).toHaveBeenCalledWith(
            expect.objectContaining({
              type: 'error/errorThrown',
              payload: expect.objectContaining({
                type: expectedPayloadType,
                messageKey: expectedPayloadMessageKey
              })
            })
          )
        })
      })
    }
  )

  it('should connect to wallet with a single chainId and retrieve one account', async () => {
    const { inMemoryGateway1, store, initialState }: InitialProps = init()
    inMemoryGateway1.setAvailable(true)
    inMemoryGateway1.setConnected(true)
    inMemoryGateway1.setAccounts(chainId1, List([account1]))
    await dispatchEnableWallet(inMemoryGateway1, chainId1, store)
    const statuses: ConnectionStatuses = Map({
      [chainId1]: 'connected'
    })
    const accountsByChainId: AccountsByChainId = Map({
      [chainId1]: List([account1])
    })
    expectEnabledWallet(store, initialState)(statuses, accountsByChainId)
  })

  it('should connect to wallet with a single chainId and retrieve multiple accounts', async () => {
    const { inMemoryGateway1, store, initialState }: InitialProps = init()
    inMemoryGateway1.setAvailable(true)
    inMemoryGateway1.setConnected(true)
    inMemoryGateway1.setAccounts(chainId1, List([account1, account2]))
    await dispatchEnableWallet(inMemoryGateway1, chainId1, store)
    const statuses: ConnectionStatuses = Map({
      [chainId1]: 'connected'
    })
    const accountsByChainId: AccountsByChainId = Map({
      [chainId1]: List([account1, account2])
    })
    expectEnabledWallet(store, initialState)(statuses, accountsByChainId)
  })

  it('should connect to wallet with multiple chainIds and retrieve multiple accounts', async () => {
    const { inMemoryGateway1, store, initialState }: InitialProps = init()
    inMemoryGateway1.setAvailable(true)
    inMemoryGateway1.setConnected(true)
    inMemoryGateway1.setAccounts(chainId1, List([account1, account2]))
    inMemoryGateway1.setAccounts(chainId2, List([account3]))
    await dispatchEnableWallet(inMemoryGateway1, chainId1, store)
    await dispatchEnableWallet(inMemoryGateway1, chainId2, store)
    const statuses: ConnectionStatuses = Map({
      [chainId1]: 'connected',
      [chainId2]: 'connected'
    })
    const accountsByChainId: AccountsByChainId = Map({
      [chainId1]: List([account1, account2]),
      [chainId2]: List([account3])
    })
    expectEnabledWallet(store, initialState)(statuses, accountsByChainId)
  })

  it('should produce an event to notify the retrieval of accounts', async () => {
    const { inMemoryGateway1, store }: InitialProps = init()
    inMemoryGateway1.setAvailable(true)
    inMemoryGateway1.setConnected(true)
    inMemoryGateway1.setAccounts(chainId1, List([account1]))
    await dispatchEnableWallet(inMemoryGateway1, chainId1, store)
    expect(mockedEventBusPublish).toHaveBeenCalledTimes(2)
    expect(mockedEventBusPublish).toHaveBeenCalledWith({
      type: 'wallet/accountsRetrieved',
      payload: { chainId: chainId1, accounts: List([account1]) }
    })
  })
})
