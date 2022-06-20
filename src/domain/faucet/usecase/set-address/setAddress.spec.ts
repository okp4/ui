import { EventBus } from 'ts-bus'
import type { AppState } from 'domain/faucet/store/appState'
import type { ReduxStore } from 'domain/faucet/store/store'
import { FaucetStoreBuilder } from 'domain/faucet/store/builder/store.builder'
import { InMemoryFaucetGateway } from 'adapters/faucet/secondary/graphql/InMemoryFaucetGateway'
import type { DeepReadonly } from 'superTypes'
import { setAddress } from './setAddress'

interface InitialProps {
  store: ReduxStore
  initialState: AppState
  eventBus: EventBus
}

describe('Set an address', () => {
  const init = (): InitialProps => {
    const eventBus = new EventBus()
    const faucetGateway = new InMemoryFaucetGateway()
    const store = new FaucetStoreBuilder()
      .withEventBus(eventBus)
      .withDependencies({ faucetGateway })
      .build()
    const initialState = store.getState()
    return { store, initialState, eventBus }
  }

  const dispatchSetAddressUsecase = async (
    address: string,
    store: DeepReadonly<ReduxStore>
  ): Promise<void> => {
    await store.dispatch(setAddress(address))
  }

  const expectSetAddress =
    (store: DeepReadonly<ReduxStore>, initialState: DeepReadonly<AppState>) =>
    (address: string): void => {
      expect(store.getState()).toEqual({
        ...initialState,
        address
      })
    }

  it('should set an address', async () => {
    const { store, initialState }: InitialProps = init()
    await dispatchSetAddressUsecase('okp41234', store)
    expectSetAddress(store, initialState)('okp41234')
  })
})
