import { Map } from 'immutable'
import type { Store, AnyAction } from 'redux'
import { Error as EntityError, Id, UnspecifiedError } from 'domain/error/entity/error'
import { ErrorStoreBuilder } from './store.builder'
import type { ErrorStoreParameters } from './store.builder'
import type { AppState } from '../appState'
import { ErrorBuilder } from 'domain/error/builder/error.builder'
import { EventBus } from 'ts-bus'

type Data = Readonly<
  Partial<{
    initialStoreParamters: ErrorStoreParameters
    eventBus: EventBus
    preloadedState: AppState
  }> & {
    expectedStatus: boolean
  }
>
const eventBusInstance = new EventBus()
const error1 = new ErrorBuilder()
  .withId('#id-1')
  .withTimestamp(new Date(1996, 12, 25))
  .withMessageKey('domain.error.unspecified-error')
  .withType('unspecified-error')
  .withContext({ stack: new Error().stack })
  .build()

const state1: AppState = {
  errors: Map<Id, EntityError>().set(error1.id, error1),
  unseenErrorId: ''
}

describe('Build an Error store', () => {
  describe.each`
    initialStoreParamters             | eventBus            | preloadedState | expectedStatus
    ${undefined}                      | ${eventBusInstance} | ${undefined}   | ${true}
    ${undefined}                      | ${eventBusInstance} | ${state1}      | ${true}
    ${{ eventBus: eventBusInstance }} | ${undefined}        | ${undefined}   | ${true}
    ${undefined}                      | ${eventBusInstance} | ${{}}          | ${false}
    ${undefined}                      | ${{}}               | ${undefined}   | ${false}
    ${undefined}                      | ${undefined}        | ${undefined}   | ${false}
    ${{ preloadedState: {} }}         | ${undefined}        | ${undefined}   | ${false}
    ${{ eventBus: {} }}               | ${undefined}        | ${undefined}   | ${false}
  `(
    'Given that eventBus is <$eventBus> and preloadedState is <$preloadedState>',
    ({ initialStoreParamters, eventBus, preloadedState, expectedStatus }: Data) => {
      describe('When building an Error Store', () => {
        const store = (): Store<AppState, AnyAction> => {
          // eslint-disable-next-line functional/no-let
          let errorStoreBuilder = new ErrorStoreBuilder(initialStoreParamters)

          if (eventBus !== undefined) {
            errorStoreBuilder = errorStoreBuilder.withEventBus(eventBus)
          }
          if (preloadedState !== undefined) {
            errorStoreBuilder = errorStoreBuilder.withPreloadedState(preloadedState)
          }
          return errorStoreBuilder.build()
        }

        test(`Then, expect ErrorStoreBuilder to ${expectedStatus ? 'succeed' : 'fail'}`, () => {
          if (expectedStatus) {
            expect(store()).toBeDefined()
            expect(store()).toHaveProperty('dispatch')
            if (preloadedState) {
              expect(store().getState()).toStrictEqual(state1)
            }
          } else {
            expect(store).toThrowError(UnspecifiedError)
          }
        })
      })
    }
  )
})
