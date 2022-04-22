import { Map } from 'immutable'
import { EventBus } from 'ts-bus'
import type { Error, Id } from 'domain/error/entity/error'
import { configureStore } from '../../store/store'
import type { AppState } from '../../store/appState'
import { getErrorById, hasUnseenError, unseenErrorMessage } from './error.selector'
import type { DeepReadonly } from 'superTypes'

type Data = DeepReadonly<{
  state: AppState
  errorId: Id
  expectedError: ReturnType<typeof getErrorById>
  expectedUnseenError: ReturnType<typeof hasUnseenError>
  expectedUnseenErrorMessage: ReturnType<typeof unseenErrorMessage>
}>

const eventBus = new EventBus()

const error1: Error = {
  id: 'id#1',
  name: 'Unspecified Error',
  message: 'Ooops .. An unspecified error occurred',
  timestamp: new Date(1996, 12, 25),
  type: 'type#unspecified-error'
}
const error2: Error = {
  id: 'id#2',
  name: 'Validation Error',
  message: 'Address prefix does not begin with OKP4',
  timestamp: new Date(1995, 11, 17),
  type: 'type#validation-error'
}

const state1: AppState = {
  errors: Map<Id, Error>().set(error1.id, error1),
  unseenErrorId: ''
}
const state2: AppState = {
  errors: Map<Id, Error>().set(error1.id, error1).set(error2.id, error2),
  unseenErrorId: 'id#1'
}

describe.each`
  state     | errorId        | expectedError | expectedUnseenError | expectedUnseenErrorMessage
  ${{}}     | ${'id#1'}      | ${undefined}  | ${false}            | ${undefined}
  ${state1} | ${'id#broken'} | ${undefined}  | ${false}            | ${undefined}
  ${state2} | ${'id#1'}      | ${error1}     | ${true}             | ${'Ooops .. An unspecified error occurred'}
`(
  'Given that state is <$state> and errorId is <$errorId>',
  ({
    state,
    errorId,
    expectedError,
    expectedUnseenError,
    expectedUnseenErrorMessage
  }: Data): void => {
    const store = configureStore(eventBus, state)
    describe('When performing selection getErrorById', () => {
      const v = getErrorById(store.getState(), errorId)

      test(`Then, expect value to be ${expectedError}`, () => {
        expect(v).toEqual(expectedError)
      })
    })

    describe('When performing selection hasUnseenError', () => {
      const v = hasUnseenError(store.getState())

      test(`Then, expect value to be ${expectedUnseenError}`, () => {
        expect(v).toEqual(expectedUnseenError)
      })
    })

    describe('When performing selection expectedUnseenErrorMessage', () => {
      const v = unseenErrorMessage(store.getState())

      test(`Then, expect value to be ${expectedUnseenErrorMessage}`, () => {
        expect(v).toEqual(expectedUnseenErrorMessage)
      })
    })
  }
)
