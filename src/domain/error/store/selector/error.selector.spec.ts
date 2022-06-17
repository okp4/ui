import { Map } from 'immutable'
import { EventBus } from 'ts-bus'
import type { Error as EntityError, Id } from 'domain/error/entity/error'
import type { AppState } from '../../store/appState'
import { getErrorById, hasUnseenError, unseenErrorMessage } from './error.selector'
import type { DeepReadonly } from 'superTypes'
import { ErrorBuilder } from 'domain/error/builder/error.builder'
import { ErrorStoreBuilder } from '../builder/store.builder'

type Data = DeepReadonly<{
  state: AppState
  errorId: Id
  expectedError: ReturnType<typeof getErrorById>
  expectedUnseenError: ReturnType<typeof hasUnseenError>
  expectedUnseenErrorMessage: ReturnType<typeof unseenErrorMessage>
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

const state1: AppState = {
  errors: Map<Id, EntityError>().set(error1.id, error1),
  unseenErrorId: ''
}
const state2: AppState = {
  errors: Map<Id, EntityError>().set(error1.id, error1).set(error2.id, error2),
  unseenErrorId: '#id-1'
}

describe.each`
  state        | errorId        | expectedError | expectedUnseenError | expectedUnseenErrorMessage
  ${undefined} | ${'#id-1'}     | ${undefined}  | ${false}            | ${undefined}
  ${state1}    | ${'id#broken'} | ${undefined}  | ${false}            | ${undefined}
  ${state2}    | ${'#id-1'}     | ${error1}     | ${true}             | ${error1.messageKey}
`(
  'Given that state is <$state> and errorId is <$errorId>',
  ({
    state,
    errorId,
    expectedError,
    expectedUnseenError,
    expectedUnseenErrorMessage
  }: Data): void => {
    const store = () => {
      const eventBusInstance = new EventBus()
      let storeBuilder = new ErrorStoreBuilder()
      if (state) {
        storeBuilder = storeBuilder.withPreloadedState(state)
      }
      return storeBuilder.withEventBus(eventBusInstance).build()
    }
    describe('When performing selection getErrorById', () => {
      const v = getErrorById(store().getState(), errorId)

      test(`Then, expect value to be ${expectedError}`, () => {
        expect(v).toEqual(expectedError)
      })
    })

    describe('When performing selection hasUnseenError', () => {
      const v = hasUnseenError(store().getState())

      test(`Then, expect value to be ${expectedUnseenError}`, () => {
        expect(v).toEqual(expectedUnseenError)
      })
    })

    describe('When performing selection expectedUnseenErrorMessage', () => {
      const v = unseenErrorMessage(store().getState())

      test(`Then, expect value to be ${expectedUnseenErrorMessage}`, () => {
        expect(v).toEqual(expectedUnseenErrorMessage)
      })
    })
  }
)
