import { act } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import type { InitializerArgs, StepperAction, StepperState } from '../useStepper'
import { useStepper } from '../useStepper'
import {
  emptyInitializerArgs,
  emptyState,
  expectedStateAfterFirstInitialization,
  expectedStateAfterPreviousClicked,
  expectedStateAfterPreviousClicked5,
  expectedStateAfterPreviousClicked7,
  stepToAdd1,
  stepToAdd2,
  stepToAdd3,
  stepToAdd4,
  stepToAdd5,
  stepToAdd6,
  expectedStateAfterStepAdded1,
  expectedStateAfterStepAdded2,
  expectedStateAfterStepAdded3,
  expectedStateAfterStepAdded4,
  expectedStateAfterStepAdded5,
  expectedStateAfterStepAdded6,
  expectedStateAfterStepCompleted1,
  expectedStateAfterStepCompleted4,
  expectedStateAfterStepCompleted6,
  expectedStateAfterStepFailed,
  expectedStateAfterStepperReset,
  expectedStateAfterStepperSubmitted,
  hookError,
  initializerArgs1,
  initializerArgs2,
  initializerArgs3,
  initializerArgs4,
  initializerArgs5,
  initializerArgs6,
  initializerArgs7,
  initializerArgs8
} from './sut'

type Data = {
  initializerArgs: InitializerArgs
  action: StepperAction
  expectedState: StepperState
  expectedError: Error | null
}

describe('Considering the useStepper hook', () => {
  describe.each`
    initializerArgs         | action                                                        | expectedState                            | expectedError
    ${emptyInitializerArgs} | ${{ type: '' }}                                               | ${emptyState}                            | ${hookError}
    ${initializerArgs2}     | ${{ type: '' }}                                               | ${emptyState}                            | ${hookError}
    ${initializerArgs3}     | ${{ type: '' }}                                               | ${emptyState}                            | ${hookError}
    ${initializerArgs4}     | ${{ type: 'unknown' }}                                        | ${expectedStateAfterFirstInitialization} | ${null}
    ${emptyInitializerArgs} | ${{ type: 'previousClicked' }}                                | ${emptyState}                            | ${hookError}
    ${initializerArgs3}     | ${{ type: 'stepperSubmitted' }}                               | ${emptyState}                            | ${hookError}
    ${initializerArgs1}     | ${{ type: 'stepCompleted' }}                                  | ${expectedStateAfterStepCompleted1}      | ${null}
    ${initializerArgs2}     | ${{ type: 'stepCompleted' }}                                  | ${emptyState}                            | ${hookError}
    ${initializerArgs3}     | ${{ type: 'stepCompleted' }}                                  | ${emptyState}                            | ${hookError}
    ${initializerArgs4}     | ${{ type: 'stepCompleted' }}                                  | ${expectedStateAfterStepCompleted4}      | ${null}
    ${initializerArgs6}     | ${{ type: 'stepCompleted' }}                                  | ${expectedStateAfterStepCompleted6}      | ${null}
    ${initializerArgs8}     | ${{ type: 'stepCompleted' }}                                  | ${expectedStateAfterStepCompleted6}      | ${null}
    ${initializerArgs4}     | ${{ type: 'stepFailed' }}                                     | ${expectedStateAfterStepFailed}          | ${null}
    ${initializerArgs4}     | ${{ type: 'previousClicked' }}                                | ${expectedStateAfterPreviousClicked}     | ${null}
    ${initializerArgs5}     | ${{ type: 'previousClicked' }}                                | ${expectedStateAfterPreviousClicked5}    | ${null}
    ${initializerArgs7}     | ${{ type: 'previousClicked' }}                                | ${expectedStateAfterPreviousClicked7}    | ${null}
    ${initializerArgs4}     | ${{ type: 'stepAddedBefore', payload: { step: stepToAdd1 } }} | ${expectedStateAfterStepAdded1}          | ${null}
    ${initializerArgs4}     | ${{ type: 'stepAddedBefore', payload: { step: stepToAdd2 } }} | ${expectedStateAfterStepAdded2}          | ${null}
    ${initializerArgs4}     | ${{ type: 'stepAddedBefore', payload: { step: stepToAdd3 } }} | ${expectedStateAfterStepAdded3}          | ${null}
    ${initializerArgs4}     | ${{ type: 'stepAddedAfter', payload: { step: stepToAdd4 } }}  | ${expectedStateAfterStepAdded4}          | ${null}
    ${initializerArgs4}     | ${{ type: 'stepAddedAfter', payload: { step: stepToAdd5 } }}  | ${expectedStateAfterStepAdded5}          | ${null}
    ${initializerArgs4}     | ${{ type: 'stepAddedAfter', payload: { step: stepToAdd6 } }}  | ${expectedStateAfterStepAdded6}          | ${null}
    ${initializerArgs4}     | ${{ type: 'stepperSubmitted' }}                               | ${expectedStateAfterStepperSubmitted}    | ${null}
    ${initializerArgs4}     | ${{ type: 'stepperReset' }}                                   | ${expectedStateAfterStepperReset}        | ${null}
  `(
    'Given an initial current step id <$initialActiveStepId> and an initial steps array',
    ({ initializerArgs, action, expectedState, expectedError }: Data) => {
      describe(`When dispatch the action of type ${action.type}`, () => {
        test(`Then, expect state to be ${JSON.stringify(expectedState)}`, () => {
          const { initialSteps, initialActiveStepId } = initializerArgs
          const { result } = renderHook(() => useStepper(initialSteps, initialActiveStepId))
          expect(result.current.error).toStrictEqual(expectedError)
          act(() => {
            result.current.dispatch(action)
          })
          expect(result.current.state).toStrictEqual(expectedState)
        })
      })
    }
  )
})
