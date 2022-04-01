import { Map, List } from 'immutable'
import type { ReduxStore } from '../../store/store'
import { configureStore } from '../../store/store'
import type { AppState } from '../../store/appState'
import { enableWallet } from './enableWallet'
import { InMemoryWalletGateway } from '../../../../gateways/InMemoryWalletGateway'
import { ConnectionError, GatewayError } from '../../entities/errors'
import type { ConnectionStatuses, Account, AccountsByChainId } from '../../entities/wallet'
import { AccountBuilder } from '../../builders/account.builder'
import { WalletRegistryGateway } from '../../../../gateways/WalletRegistryGateway'
import type { DeepReadonly } from '../../../../superTypes'

interface InitialProps {
  walletRegistryGateway: WalletRegistryGateway
  inMemoryGateway1: InMemoryWalletGateway
  store: ReduxStore
  initialState: AppState
}

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
    const store = configureStore({ walletRegistryGateway })
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
      accounts: DeepReadonly<AccountsByChainId>,
      error: DeepReadonly<Error> | null
    ): void => {
      expect(store.getState()).toEqual({
        ...initialState,
        connectionStatuses,
        accounts,
        error
      })
    }

  it('should report a GatewayError if gateway is not correctly registered', async () => {
    const { walletRegistryGateway, inMemoryGateway1, store, initialState }: InitialProps = init()
    walletRegistryGateway.clear()
    await dispatchEnableWallet(inMemoryGateway1, chainId1, store)
    const error = new GatewayError(
      `Ooops ... No gateway was found with this wallet id : ${inMemoryGateway1.id()}`
    )
    expectEnabledWallet(store, initialState)(Map(), Map(), error)
  })

  it('should report a ConnectionError if not available', async () => {
    const { inMemoryGateway1, store, initialState }: InitialProps = init()
    inMemoryGateway1.setAvailable(false)
    await dispatchEnableWallet(inMemoryGateway1, chainId1, store)
    const error = new ConnectionError()
    expectEnabledWallet(store, initialState)(Map(), Map(), error)
  })

  it('should report a ConnectionError if not connected', async () => {
    const { inMemoryGateway1, store, initialState }: InitialProps = init()
    inMemoryGateway1.setAvailable(true)
    inMemoryGateway1.setConnected(false)
    await dispatchEnableWallet(inMemoryGateway1, chainId1, store)
    const error = new ConnectionError()
    expectEnabledWallet(store, initialState)(Map(), Map(), error)
  })

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
    expectEnabledWallet(store, initialState)(statuses, accountsByChainId, null)
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
    expectEnabledWallet(store, initialState)(statuses, accountsByChainId, null)
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
    expectEnabledWallet(store, initialState)(statuses, accountsByChainId, null)
  })
})
