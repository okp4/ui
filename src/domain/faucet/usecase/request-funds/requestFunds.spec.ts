import { EventBus } from 'ts-bus'
import type { AppState } from 'domain/faucet/store/appState'
import type { ReduxStore } from 'domain/faucet/store/store'
import { configureStore } from 'domain/faucet/store/store'
import { requestFunds } from './requestFunds'
import type { DeepReadonly } from 'superTypes'
import { InMemoryFaucetGateway } from 'adapters/faucet/secondary/InMemoryFaucetGateway'

interface InitialProps {
  store: ReduxStore
  initialState: AppState
  faucetGateway: InMemoryFaucetGateway
}

interface Data {
  hasGatewayError: boolean
  address: string
  expectedPayloadType: string
  expectedPayloadMessageKey: string
  expectedHaveBeenCalledTimes: number
}

const eventBus = new EventBus()
const mockedEventBusPublish = jest.spyOn(eventBus, 'publish')

afterEach(() => {
  jest.clearAllMocks()
})

describe('Request funds from faucet', () => {
  const init = (): InitialProps => {
    const faucetGateway = new InMemoryFaucetGateway()
    const store = configureStore({ faucetGateway }, eventBus)
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
    (isProcessing: boolean): void => {
      expect(store.getState()).toEqual({
        ...initialState,
        isProcessing
      })
    }

  describe.each`
    hasGatewayError | address                                            | expectedPayloadType   | expectedPayloadMessageKey          | expectedHaveBeenCalledTimes
    ${false}        | ${'123'}                                           | ${'validation-error'} | ${'domain.error.validation-error'} | ${1}
    ${false}        | ${'cosmos196877dj4crpxmja2ww2hj2vgy45v6uspm7nrmy'} | ${'validation-error'} | ${'domain.error.validation-error'} | ${1}
    ${true}         | ${'okp4196877dj4crpxmja2ww2hj2vgy45v6uspkzkt8l'}   | ${'gateway-error'}    | ${'domain.error.gateway-error'}    | ${2}
  `(
    'Given that hasGatewayError is <$hasGatewayError> and address is <$address>',
    ({
      hasGatewayError,
      address,
      expectedPayloadType,
      expectedPayloadMessageKey,
      expectedHaveBeenCalledTimes
    }: Readonly<Data>): void => {
      const { store, faucetGateway }: InitialProps = init()
      hasGatewayError && faucetGateway.setError()
      describe('When requesting funds', () => {
        test('Then, expect an error event to be published', async () => {
          await dispatchRequestFundsUsecase(address, store)
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

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  it('should be aware of the processing status', (done: jest.DoneCallback) => {
    const { store, initialState }: InitialProps = init()
    const unsubscribe = store.subscribe(() => {
      expectRequestFunds(store, initialState)(true)
      unsubscribe()
      done()
    })
    expect.assertions(1)
    dispatchRequestFundsUsecase('okp4196877dj4crpxmja2ww2hj2vgy45v6uspkzkt8l', store)
  })

  it('should not process anymore after requesting for funds', async () => {
    const { store, initialState }: InitialProps = init()
    await dispatchRequestFundsUsecase('okp4196877dj4crpxmja2ww2hj2vgy45v6uspkzkt8l', store)
    expectRequestFunds(store, initialState)(false)
  })
})
