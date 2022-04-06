/* eslint-disable @typescript-eslint/typedef */
import { GatewayError, ValidationError } from 'domain/faucet/entities/error'
import type { AppState, FaucetStatus } from 'domain/faucet/store/appState'
import type { ReduxStore } from 'domain/faucet/store/store'
import { configureStore } from 'domain/faucet/store/store'
import { askTokens } from './askTokens'
import type { DeepReadonly } from '../../../../superTypes'
import { InMemoryFaucetGateway } from '../../../../gateway/faucet/InMemoryFaucetGateway'

interface InitialProps {
  store: ReduxStore
  initialState: AppState
  faucetGateway: InMemoryFaucetGateway
}

describe('Ask tokens from faucet', () => {
  const init = (): InitialProps => {
    const faucetGateway = new InMemoryFaucetGateway()
    const store = configureStore({ faucetGateway })
    const initialState = store.getState()
    return { store, initialState, faucetGateway }
  }

  const dispatchAskTokensUsecase = async (
    address: string,
    store: DeepReadonly<ReduxStore>
  ): Promise<void> => {
    await store.dispatch(askTokens(address))
  }

  const expectAskTokens =
    (store: DeepReadonly<ReduxStore>, initialState: DeepReadonly<AppState>) =>
    (status: Readonly<FaucetStatus>, error: DeepReadonly<Error> | null): void => {
      expect(store.getState()).toEqual({
        ...initialState,
        status,
        error
      })
    }

  it('should report a ValidationError if provided address is too short', async () => {
    const { store, initialState }: InitialProps = init()
    await dispatchAskTokensUsecase('123', store)
    expectAskTokens(store, initialState)(
      'error',
      new ValidationError('Data part of the message too short (at least 6 chars expected)')
    )
  })

  it('should report a ValidationError if provided address does not begin with okp4', async () => {
    const { store, initialState }: InitialProps = init()
    await dispatchAskTokensUsecase('cosmos196877dj4crpxmja2ww2hj2vgy45v6uspm7nrmy', store)
    expectAskTokens(store, initialState)(
      'error',
      new ValidationError('Address prefix does not begin with OKP4')
    )
  })

  it('should report a GatewayError if something went wrong while asking tokens', async () => {
    const { store, initialState, faucetGateway }: InitialProps = init()
    faucetGateway.setError()
    await dispatchAskTokensUsecase('okp4196877dj4crpxmja2ww2hj2vgy45v6uspkzkt8l', store)
    expectAskTokens(store, initialState)('error', new GatewayError())
  })

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  it('should be aware of the processing status', done => {
    const { store, initialState }: InitialProps = init()
    const unsubscribe = store.subscribe(() => {
      expectAskTokens(store, initialState)('processing', null)
      unsubscribe()
      done()
    })
    expect.assertions(1)
    dispatchAskTokensUsecase('okp4196877dj4crpxmja2ww2hj2vgy45v6uspkzkt8l', store)
  })

  it('should report a sucess status after asking for tokens', async () => {
    const { store, initialState }: InitialProps = init()
    await dispatchAskTokensUsecase('okp4196877dj4crpxmja2ww2hj2vgy45v6uspkzkt8l', store)
    expectAskTokens(store, initialState)('success', null)
  })
})
