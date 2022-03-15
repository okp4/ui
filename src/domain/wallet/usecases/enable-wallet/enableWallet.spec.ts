import { configureStore, ReduxStore } from '../../store/store'
import { AppState } from '../../store/appState'
import { enableWallet } from './enableWallet'
import { InMemoryWalletGateway } from '../../../../gateways/InMemoryWalletGateway'
import { ConnectionError } from 'domain/wallet/entities/errors'
import { ConnectionStatuses } from 'domain/wallet/entities/wallet'

describe('Enable wallet', () => {
  let store: ReduxStore
  let walletGateway: InMemoryWalletGateway
  let initialState: AppState

  beforeEach(() => {
    walletGateway = new InMemoryWalletGateway()
    store = configureStore({ walletGateway })
    initialState = store.getState()
  })

  it('should report an error if not connected', async () => {
    walletGateway.setConnected(false)
    await dispatchEnableWallet('chainId#1')
    const error = new ConnectionError()
    expectWallet({}, error)
  })

  it('should report a single connection status with one chain id', async () => {
    walletGateway.setConnected(true)
    await dispatchEnableWallet('chainId#1')
    const statuses: ConnectionStatuses = {
      'chainId#1': 'connected',
    }
    expectWallet(statuses, null)
  })

  it("should report multiple connection statuses with multiple chain id's", async () => {
    walletGateway.setConnected(true)
    await dispatchEnableWallet('chainId#1')
    await dispatchEnableWallet('chainId#2')
    const statuses: ConnectionStatuses = {
      'chainId#1': 'connected',
      'chainId#2': 'connected',
    }
    expectWallet(statuses, null)
  })

  const dispatchEnableWallet = async (chainId: string) => {
    await store.dispatch(enableWallet(chainId))
  }

  const expectWallet = (
    connectedStatuses: ConnectionStatuses,
    error: ConnectionError | null
  ) => {
    expect(store.getState()).toEqual({
      ...initialState,
      connectedStatuses,
      error,
    })
  }
})
