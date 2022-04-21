import short from 'short-uuid'
import { EventBus } from 'ts-bus'
import type { Error } from 'domain/error/entity/error'
import { ReportErrorActions } from '../report-error/actionCreators'
import { acknowledgeError } from './acknowledgeError'
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

describe('Acknowledge an error', () => {
  it('should acknowledge an error which has been reported and handled by user', async () => {
    const { store }: InitialProps = init()
    store.dispatch(ReportErrorActions.errorReported(error))
    expect(store.getState().unseenErrorId).toEqual(error.id)
    await store.dispatch(acknowledgeError())
    expect(store.getState().unseenErrorId).toEqual('')
  })
})
