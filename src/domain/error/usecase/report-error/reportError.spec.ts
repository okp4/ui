import { Map } from 'immutable'
import short from 'short-uuid'
import { EventBus } from 'ts-bus'
import type { Error } from 'domain/error/entity/error'
import { reportError } from './reportError'
import { configureStore } from '../../store/store'
import type { ReduxStore } from '../../store/store'
import type { AppState } from '../../store/appState'

type InitialProps = Readonly<{
  store: ReduxStore
  initialState: AppState
  eventBus: EventBus
}>

const error: Error = {
  id: short.generate(),
  name: 'Validation Error',
  message: 'Address prefix does not begin with OKP4',
  timeStamp: new Date(1995, 11, 17),
  type: 'type#validation-error'
}

const init = (): InitialProps => {
  const eventBus = new EventBus()
  const store = configureStore(eventBus)
  const initialState = store.getState()
  return { store, initialState, eventBus }
}

describe('Report an error', () => {
  it('should not have any error when there are not reported one', () => {
    const { store, initialState }: InitialProps = init()
    expect(store.getState()).toEqual({ ...initialState, errors: Map(), hasErrorUnseen: false })
  })

  it('should report a validation error and mark it as unseen', async () => {
    const { store, initialState }: InitialProps = init()
    await store.dispatch(reportError(error))
    expect(store.getState()).toEqual({
      ...initialState,
      errors: Map().set(error.id, error),
      hasErrorUnseen: true
    })
  })
})
