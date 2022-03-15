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

describe('Enable wallet', () => {
  let store: ReduxStore
  let walletGateway: InMemoryWalletGateway
  let initialState: AppState
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
    walletGateway = new InMemoryWalletGateway()
    store = configureStore({ walletGateway })
    initialState = store.getState()
  })

  it('should report a ConnectionError if not connected', async () => {
    walletGateway.setConnected(false)
    await dispatchEnableWallet(chainId1)
    const error = new ConnectionError()
    expectEnabledWallet({}, {}, error)
  })

  it('should connect to wallet with a single chainId and retrieve one account', async () => {
    walletGateway.setConnected(true)
    walletGateway.setAccounts(chainId1, [account1])
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
    walletGateway.setConnected(true)
    walletGateway.setAccounts(chainId1, [account1, account2])
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
    walletGateway.setConnected(true)
    walletGateway.setAccounts(chainId1, [account1, account2])
    walletGateway.setAccounts(chainId2, [account3])
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
    await store.dispatch(enableWallet(chainId))
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
