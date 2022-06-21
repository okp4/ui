import { Map } from 'immutable'
import { EventBus } from 'ts-bus'
import type { BusEvent } from 'ts-bus/types'
import type { Error as EntityError } from 'domain/error/entity/error'
import type { ReduxStore } from 'domain/error/store/store'
import type { AppState } from 'domain/error/store/appState'
import type { DeepReadonly } from 'superTypes'
import { ErrorBuilder } from 'domain/error/builder/error.builder'
import { EventMetadata } from 'eventBus/eventBus'
import { ErrorStoreBuilder } from 'domain/error/store/builder/store.builder'

type InitialProps = Readonly<{
  store: ReduxStore
  eventBusInstance: EventBus
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
  const eventBusInstance = new EventBus()
  const store = new ErrorStoreBuilder().withEventBus(eventBusInstance).build()
  return { store, eventBusInstance }
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
  const { store, eventBusInstance }: InitialProps = init()

  describe("When publishing an 'error/errorThrown event", () => {
    beforeEach(() => {
      event && eventBusInstance.publish(event, meta)
    })
    test(`Then, expect state to be ${expectedState}`, () => {
      expect(store.getState()).toEqual(expectedState)
    })
  })
})
