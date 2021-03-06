import { EventBus } from 'ts-bus'
import { ReportErrorActions } from '../report-error/actionCreators'
import { acknowledgeError } from './acknowledgeError'
import type { ReduxStore } from '../../store/store'
import type { AppState } from '../../store/appState'
import { ErrorBuilder } from 'domain/error/builder/error.builder'
import { ErrorStoreBuilder } from 'domain/error/store/builder/store.builder'

type InitialProps = Readonly<{
  store: ReduxStore
  initialState: AppState
}>

const error = new ErrorBuilder()
  .withId('#id-1')
  .withTimestamp(new Date(1996, 12, 25))
  .withMessageKey('domain.error.validation-error')
  .withType('validation-error')
  .withContext({ stack: new Error().stack })
  .build()

const init = (): InitialProps => {
  const eventBusInstance = new EventBus()
  const store = new ErrorStoreBuilder().withEventBus(eventBusInstance).build()
  const initialState = store.getState()
  return { store, initialState }
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
