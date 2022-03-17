import { configureStore, ReduxStore } from '../../store/store'
import { AppState } from '../../store/appState'
import { enableWallet } from './enableWallet'
import { InMemoryWalletGateway } from '../../../../gateways/InMemoryWalletGateway'
import { ConnectionError, GatewayError } from 'domain/wallet/entities/errors'
import {
  ConnectionStatuses,
  Account,
  AccountsByChainId,
} from 'domain/wallet/entities/wallet'
import { AccountBuilder } from 'domain/wallet/builders/account.builder'
import { WalletRegistryGateway } from '../../../../gateways/WalletRegistryGateway'

describe('Enable wallet', () => {
  let store: ReduxStore
  let walletRegistryGateway: WalletRegistryGateway
  let initialState: AppState
  let inMemoryGateway1: InMemoryWalletGateway
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

  beforeEach(() => {
    walletRegistryGateway = new WalletRegistryGateway()
    inMemoryGateway1 = new InMemoryWalletGateway()
    walletRegistryGateway.register(inMemoryGateway1)
    store = configureStore({ walletRegistryGateway })
    initialState = store.getState()
  })

  it('should report a GatewayError if gateway is not correctly registered', async () => {
    walletRegistryGateway.clear()
    await dispatchEnableWallet(inMemoryGateway1, chainId1)
    const error = new GatewayError(
      `Ooops ... No gateway was found with this wallet id : ${inMemoryGateway1.id()}`
    )
    expectEnabledWallet({}, {}, error)
  })

  it('should report a ConnectionError if not available', async () => {
    inMemoryGateway1.setAvailable(false)
    await dispatchEnableWallet(inMemoryGateway1, chainId1)
    const error = new ConnectionError()
    expectEnabledWallet({}, {}, error)
  })

  it('should report a ConnectionError if not connected', async () => {
    inMemoryGateway1.setAvailable(true)
    inMemoryGateway1.setConnected(false)
    await dispatchEnableWallet(inMemoryGateway1, chainId1)
    const error = new ConnectionError()
    expectEnabledWallet({}, {}, error)
  })

  it('should connect to wallet with a single chainId and retrieve one account', async () => {
    inMemoryGateway1.setAvailable(true)
    inMemoryGateway1.setConnected(true)
    inMemoryGateway1.setAccounts(chainId1, [account1])
    await dispatchEnableWallet(inMemoryGateway1, chainId1)
    const statuses: ConnectionStatuses = {
      [chainId1]: 'connected',
    }
    const accountsByChainId: AccountsByChainId = {
      [chainId1]: [account1],
    }
    expectEnabledWallet(statuses, accountsByChainId, null)
  })

  it('should connect to wallet with a single chainId and retrieve multiple accounts', async () => {
    inMemoryGateway1.setAvailable(true)
    inMemoryGateway1.setConnected(true)
    inMemoryGateway1.setAccounts(chainId1, [account1, account2])
    await dispatchEnableWallet(inMemoryGateway1, chainId1)
    const statuses: ConnectionStatuses = {
      [chainId1]: 'connected',
    }
    const accountsByChainId: AccountsByChainId = {
      [chainId1]: [account1, account2],
    }
    expectEnabledWallet(statuses, accountsByChainId, null)
  })

  it('should connect to wallet with multiple chainIds and retrieve multiple accounts', async () => {
    inMemoryGateway1.setAvailable(true)
    inMemoryGateway1.setConnected(true)
    inMemoryGateway1.setAccounts(chainId1, [account1, account2])
    inMemoryGateway1.setAccounts(chainId2, [account3])
    await dispatchEnableWallet(inMemoryGateway1, chainId1)
    await dispatchEnableWallet(inMemoryGateway1, chainId2)
    const statuses: ConnectionStatuses = {
      [chainId1]: 'connected',
      [chainId2]: 'connected',
    }
    const accountsByChainId: AccountsByChainId = {
      [chainId1]: [account1, account2],
      [chainId2]: [account3],
    }
    expectEnabledWallet(statuses, accountsByChainId, null)
  })

  const dispatchEnableWallet = async (
    gateway: InMemoryWalletGateway,
    chainId: string
  ) => {
    await store.dispatch(enableWallet(gateway.id(), chainId))
  }

  const expectEnabledWallet = (
    connectionStatuses: ConnectionStatuses,
    accounts: AccountsByChainId,
    error: Error | null
  ) => {
    expect(store.getState()).toEqual({
      ...initialState,
      connectionStatuses,
      accounts,
      error,
    })
  }
})
