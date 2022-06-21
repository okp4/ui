import { Map } from 'immutable'
import { EventBus } from 'ts-bus'
import { reportError } from './reportError'
import type { ReduxStore } from '../../store/store'
import { ErrorBuilder } from 'domain/error/builder/error.builder'
import { ErrorStoreBuilder } from 'domain/error/store/builder/store.builder'

type InitialProps = Readonly<{
  store: ReduxStore
}>

const error = new ErrorBuilder()
  .withId('#id-1')
  .withTimestamp(new Date(1996, 12, 25))
  .withMessageKey('domain.error.unspecified-error')
  .withType('unspecified-error')
  .withContext({ stack: new Error().stack })
  .build()

const init = (): InitialProps => {
  const eventBusInstance = new EventBus()
  const store = new ErrorStoreBuilder().withEventBus(eventBusInstance).build()
  return { store }
}

describe('Report an error', () => {
  it('should not have any error when there are not reported one', () => {
    const { store }: InitialProps = init()
    expect(store.getState()).toEqual({ errors: Map(), unseenErrorId: '' })
  })

  it('should report a validation error and mark it as unseen', async () => {
    const { store }: InitialProps = init()
    await store.dispatch(reportError(error))
    expect(store.getState()).toEqual({
      errors: Map().set(error.id, error),
      unseenErrorId: error.id
    })
  })
})
