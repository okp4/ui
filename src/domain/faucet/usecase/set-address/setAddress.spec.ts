/* eslint-disable @typescript-eslint/typedef */
import type { AppState } from 'domain/faucet/store/appState'
import type { ReduxStore } from 'domain/faucet/store/store'
import { configureStore } from 'domain/faucet/store/store'
import type { DeepReadonly } from '../../../../superTypes'
import { setAddress } from './setAddress'

interface InitialProps {
  store: ReduxStore
  initialState: AppState
}

describe('Set an address', () => {
  const init = (): InitialProps => {
    const store = configureStore({})
    const initialState = store.getState()
    return { store, initialState }
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
