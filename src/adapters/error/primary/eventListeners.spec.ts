import { Map } from 'immutable'
import { EventBus } from 'ts-bus'
import type { BusEvent } from 'ts-bus/types'
import type { Error as EntityError } from 'domain/error/entity/error'
import { configureStore } from 'domain/error/store/store'
import type { ReduxStore } from 'domain/error/store/store'
import type { AppState } from 'domain/error/store/appState'
import { initErrorEventListeners } from 'adapters/error/primary/eventListeners'
import type { DeepReadonly } from 'superTypes'
import { ErrorBuilder } from 'domain/error/builder/error.builder'
import type { EventMetadata } from 'eventBus/eventBus'

type InitialProps = Readonly<{
  store: ReduxStore
  eventBus: EventBus
}>

type Data = DeepReadonly<{
  event: BusEvent | undefined
  expectedState: AppState
}>

const error = new ErrorBuilder()
  .withId('#id-1')
  .withTimestamp(new Date(1995, 11, 17))
  .withMessageKey('domain.error.validation-error')
  .withType('validation-error')
  .withContext({ stack: new Error().stack })
  .build()

const meta: EventMetadata = { initiator: 'domain:test', timestamp: new Date() }

const init = (): InitialProps => {
  const eventBus = new EventBus()
  const store = configureStore(eventBus)
  initErrorEventListeners(store, eventBus)
  return { store, eventBus }
}

const expectedState = (
  errors: DeepReadonly<AppState['errors']>,
  unseenErrorId: AppState['unseenErrorId']
): AppState => ({
  errors,
  unseenErrorId
})

describe.each`
  event                                            | expectedState
  ${undefined}                                     | ${expectedState(Map(), '')}
  ${{ type: 'error/fooBar', payload: error }}      | ${expectedState(Map(), '')}
  ${{ type: 'error/errorThrown', payload: error }} | ${expectedState(Map<string, EntityError>().set(error.id, { ...error, initiator: meta.initiator }), error.id)}
`('Given that event is <$event>', ({ event, expectedState }: Data): void => {
  const { store, eventBus }: InitialProps = init()

  describe("When publishing an 'error/errorThrown event", () => {
    event && eventBus.publish(event, meta)

    test(`Then, expect state to be ${expectedState}`, () => {
      expect(store.getState()).toEqual(expectedState)
    })
  })
})
