import { configureStore, ReduxStore } from '../../store/store'
import { AppState } from '../../store/appState'
import { enableWallet } from './enableWallet'
import { InMemoryWalletGateway } from '../../../../gateways/InMemoryWalletGateway'
import { ConnectionError } from 'domain/wallet/entities/errors'
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
  const inMemoryGateway = new InMemoryWalletGateway()
  const chainId1 = 'chainId#1'
  const chainId2 = 'chainId#2'
  const publicKey1: Uint8Array = new Uint8Array()
  const publicKey2: Uint8Array = new Uint8Array()
  const publicKey3: Uint8Array = new Uint8Array()
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
    walletRegistryGateway.register(inMemoryGateway)
    store = configureStore({ walletRegistryGateway })
    initialState = store.getState()
  })

  it('should report a ConnectionError if not connected', async () => {
    inMemoryGateway.setConnected(false)
    await dispatchEnableWallet(chainId1)
    const error = new ConnectionError()
    expectEnabledWallet({}, {}, error)
  })

  it('should connect to wallet with a single chainId and retrieve one account', async () => {
    inMemoryGateway.setConnected(true)
    inMemoryGateway.setAccounts(chainId1, [account1])
    await dispatchEnableWallet(chainId1)
    const statuses: ConnectionStatuses = {
      [chainId1]: 'connected',
    }
    const accountsByChainId: AccountsByChainId = {
      [chainId1]: [account1],
    }
    expectEnabledWallet(statuses, accountsByChainId, null)
  })

  it('should connect to wallet with a single chainId and retrieve multiple accounts', async () => {
    inMemoryGateway.setConnected(true)
    inMemoryGateway.setAccounts(chainId1, [account1, account2])
    await dispatchEnableWallet(chainId1)
    const statuses: ConnectionStatuses = {
      [chainId1]: 'connected',
    }
    const accountsByChainId: AccountsByChainId = {
      [chainId1]: [account1, account2],
    }
    expectEnabledWallet(statuses, accountsByChainId, null)
  })

  it('should connect to wallet with multiple chainIds and retrieve multiple accounts', async () => {
    inMemoryGateway.setConnected(true)
    inMemoryGateway.setAccounts(chainId1, [account1, account2])
    inMemoryGateway.setAccounts(chainId2, [account3])
    await dispatchEnableWallet(chainId1)
    await dispatchEnableWallet(chainId2)
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

  const dispatchEnableWallet = async (chainId: string) => {
    await store.dispatch(enableWallet(inMemoryGateway.id(), chainId))
  }

  const expectEnabledWallet = (
    connectionStatuses: ConnectionStatuses,
    accounts: AccountsByChainId,
    error: ConnectionError | null
  ) => {
    expect(store.getState()).toEqual({
      ...initialState,
      connectionStatuses,
      accounts,
      error,
    })
  }
})
