import { Map } from 'immutable'
import { EventBus } from 'ts-bus'
import type { BusEvent } from 'ts-bus/types'
import type { Error } from 'domain/error/entity/error'
import { configureStore } from 'domain/error/store/store'
import type { ReduxStore } from 'domain/error/store/store'
import type { AppState } from 'domain/error/store/appState'
import { initErrorEventListeners } from 'adapters/error/primary/eventListeners'
import type { DeepReadonly } from 'superTypes'

type InitialProps = Readonly<{
  store: ReduxStore
  eventBus: EventBus
}>

type Data = DeepReadonly<{
  event: BusEvent | undefined
  expectedState: AppState
}>

const error: Error = {
  id: '#id-1',
  name: 'Validation Error',
  message: 'Address prefix does not begin with OKP4',
  timestamp: new Date(1995, 11, 17),
  type: 'type#validation-error'
}

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
  ${{ type: 'error/errorThrown', payload: error }} | ${expectedState(Map<string, Error>().set(error.id, error), error.id)}
`('Given that event is <$event>', ({ event, expectedState }: Data): void => {
  const { store, eventBus }: InitialProps = init()

  describe("When publishing an 'error/errorThrown event", () => {
    event && eventBus.publish(event)

    test(`Then, expect state to be ${expectedState}`, () => {
      expect(store.getState()).toEqual(expectedState)
    })
  })
})
