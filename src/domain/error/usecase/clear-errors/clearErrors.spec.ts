import { Map } from 'immutable'
import { EventBus } from 'ts-bus'
import { ReportErrorActions } from '../report-error/actionCreators'
import { clearErrors } from './clearErrors'
import type { ReduxStore } from '../../store/store'
import type { AppState } from '../../store/appState'
import { ErrorBuilder } from 'domain/error/builder/error.builder'
import { ErrorStoreBuilder } from 'domain/error/store/builder/store.builder'

type InitialProps = Readonly<{
  store: ReduxStore
  initialState: AppState
}>

const error1 = new ErrorBuilder()
  .withId('#id-1')
  .withTimestamp(new Date(1996, 12, 25))
  .withMessageKey('domain.error.unspecified-error')
  .withType('unspecified-error')
  .withContext({ stack: new Error().stack })
  .build()
const error2 = new ErrorBuilder()
  .withId('#id-2')
  .withTimestamp(new Date(1995, 11, 17))
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

describe('Clear all errors', () => {
  it('should clear all reported errors', async () => {
    const { store }: InitialProps = init()
    store.dispatch(ReportErrorActions.errorReported(error1))
    store.dispatch(ReportErrorActions.errorReported(error2))
    await store.dispatch(clearErrors())
    expect(store.getState().errors).toEqual(Map())
  })
})
