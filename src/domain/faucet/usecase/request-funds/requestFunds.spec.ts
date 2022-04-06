/* eslint-disable @typescript-eslint/typedef */
import { GatewayError, ValidationError } from 'domain/faucet/entity/error'
import type { AppState, FaucetStatus } from 'domain/faucet/store/appState'
import type { ReduxStore } from 'domain/faucet/store/store'
import { configureStore } from 'domain/faucet/store/store'
import { requestFunds } from './requestFunds'
import type { DeepReadonly } from '../../../../superTypes'
import { InMemoryFaucetGateway } from '../../../../gateway/faucet/InMemoryFaucetGateway'

interface InitialProps {
  store: ReduxStore
  initialState: AppState
  faucetGateway: InMemoryFaucetGateway
}

describe('Request funds from faucet', () => {
  const init = (): InitialProps => {
    const faucetGateway = new InMemoryFaucetGateway()
    const store = configureStore({ faucetGateway })
    const initialState = store.getState()
    return { store, initialState, faucetGateway }
  }

  const dispatchRequestFundsUsecase = async (
    address: string,
    store: DeepReadonly<ReduxStore>
  ): Promise<void> => {
    await store.dispatch(requestFunds(address))
  }

  const expectRequestFunds =
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
    await dispatchRequestFundsUsecase('123', store)
    expectRequestFunds(store, initialState)(
      'error',
      new ValidationError('Data part of the message too short (at least 6 chars expected)')
    )
  })

  it('should report a ValidationError if provided address does not begin with okp4', async () => {
    const { store, initialState }: InitialProps = init()
    await dispatchRequestFundsUsecase('cosmos196877dj4crpxmja2ww2hj2vgy45v6uspm7nrmy', store)
    expectRequestFunds(store, initialState)(
      'error',
      new ValidationError('Address prefix does not begin with OKP4')
    )
  })

  it('should report a GatewayError if something went wrong while requesting funds', async () => {
    const { store, initialState, faucetGateway }: InitialProps = init()
    faucetGateway.setError()
    await dispatchRequestFundsUsecase('okp4196877dj4crpxmja2ww2hj2vgy45v6uspkzkt8l', store)
    expectRequestFunds(store, initialState)('error', new GatewayError())
  })

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  it('should be aware of the processing status', done => {
    const { store, initialState }: InitialProps = init()
    const unsubscribe = store.subscribe(() => {
      expectRequestFunds(store, initialState)('processing', null)
      unsubscribe()
      done()
    })
    expect.assertions(1)
    dispatchRequestFundsUsecase('okp4196877dj4crpxmja2ww2hj2vgy45v6uspkzkt8l', store)
  })

  it('should report a sucess status after requesting for funds', async () => {
    const { store, initialState }: InitialProps = init()
    await dispatchRequestFundsUsecase('okp4196877dj4crpxmja2ww2hj2vgy45v6uspkzkt8l', store)
    expectRequestFunds(store, initialState)('success', null)
  })
})
