import { Map } from 'immutable'
import short from 'short-uuid'
import { EventBus } from 'ts-bus'
import type { Error } from 'domain/error/entity/error'
import { ReportErrorActions } from '../report-error/actionCreators'
import { clearError } from './clearError'
import { configureStore } from '../../store/store'
import type { ReduxStore } from '../../store/store'
import type { AppState } from '../../store/appState'

type InitialProps = Readonly<{
  store: ReduxStore
  initialState: AppState
  eventBus: EventBus
}>

const error1: Error = {
  id: short.generate(),
  name: 'Unspecified Error',
  message: 'Ooops .. An unspecified error occurred',
  timestamp: new Date(1996, 12, 25),
  type: 'type#unspecified-error'
}
const error2: Error = {
  id: short.generate(),
  name: 'Validation Error',
  message: 'Address prefix does not begin with OKP4',
  timestamp: new Date(1995, 11, 17),
  type: 'type#validation-error'
}

const init = (): InitialProps => {
  const eventBus = new EventBus()
  const store = configureStore(eventBus)
  const initialState = store.getState()
  return { store, initialState, eventBus }
}

describe('Clear one error', () => {
  it('should clear one specific error by its id', async () => {
    const { store }: InitialProps = init()
    store.dispatch(ReportErrorActions.errorReported(error1))
    store.dispatch(ReportErrorActions.errorReported(error2))
    await store.dispatch(clearError(error1.id))
    expect(store.getState().errors).toEqual(Map().set(error2.id, error2))
  })
})
