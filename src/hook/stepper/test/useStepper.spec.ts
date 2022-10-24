import { act } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import type {
  InitializerArgs,
  InitialStep,
  StepperAction,
  StepperState,
  Step,
  StepWithBeforeOrder,
  StepWithAfterOrder
} from '../useStepper'
import { useStepper } from '../useStepper'
import {
  hookError,
  emptyState,
  emptyInitializerArgs,
  initializerArgs1,
  initializerArgs2,
  initializerArgs3,
  expectedStateAfterInitialization,
  expectedStateAfterStepCompleted
} from './sut'

type Data = {
  initializerArgs: InitializerArgs
  action: StepperAction
  expectedState: StepperState
  expectedError: Error | null
}

describe('Considering the useStepper hook', () => {
  // Initial steps

  const initialStep1: InitialStep = {
    id: '#id1',
    status: 'uncompleted'
  }

  const initialStep2: InitialStep = {
    id: '',
    status: 'uncompleted'
  }

  const initialStep3: InitialStep = {
    id: '#id3',
    status: 'uncompleted'
  }

  const initialStep4: InitialStep = {
    id: '#id4',
    status: 'uncompleted'
  }

  const initialStep5: InitialStep = {
    id: '#id27',
    status: 'completed'
  }

  const initialStep6: InitialStep = {
    id: '#id28',
    status: 'uncompleted'
  }

  // Steps to add
  const stepToAdd1: StepWithBeforeOrder = {
    id: '#id5',
    beforeOrder: 1,
    status: 'uncompleted'
  }

  const stepToAdd2: StepWithBeforeOrder = {
    id: '#id6',
    beforeOrder: 12,
    status: 'uncompleted'
  }

  const stepToAdd3: StepWithBeforeOrder = {
    id: '#id7',
    beforeOrder: -1,
    status: 'uncompleted'
  }

  const stepToAdd4: StepWithAfterOrder = {
    id: '#id5',
    afterOrder: 1,
    status: 'uncompleted'
  }

  // After "PreviousClicked" action dispatched
  // const steps3 = emptyState.steps
  //   .set(initialStep1.id, {
  //     active: false,
  //     status: 'uncompleted',
  //     order: 0
  //   })
  //   .set(initialStep3.id, {
  //     active: true,
  //     status: 'uncompleted',
  //     order: 1
  //   })
  //   .set(initialStep4.id, {
  //     active: false,
  //     status: 'uncompleted',
  //     order: 2
  //   })
  // const expectedStateAfterPreviousClicked: StepperState = {
  //   steps: steps3,
  //   initialSteps: steps1.set(initialStep4.id, {
  //     active: false,
  //     status: 'uncompleted',
  //     order: 2
  //   })
  // }

  const expectedState4 = {
    steps: emptyState.steps
      .set(initialStep1.id, {
        active: false,
        status: 'uncompleted',
        order: 0
      })
      .set(initialStep3.id, {
        active: false,
        status: 'uncompleted',
        order: 1
      })
      .set(initialStep4.id, {
        active: true,
        status: 'invalid',
        order: 2
      })
  }

  const expectedState5 = {
    steps: emptyState.steps
      .set(initialStep1.id, {
        active: true,
        status: 'uncompleted',
        order: 0
      })
      .set(initialStep3.id, {
        active: false,
        status: 'uncompleted',
        order: 2
      })
      .set(initialStep4.id, {
        active: false,
        status: 'uncompleted',
        order: 3
      })
      .set(stepToAdd1.id, {
        active: false,
        status: 'uncompleted',
        order: 1
      })
  }

  const expectedState6 = {
    steps: emptyState.steps
      .set(initialStep1.id, {
        active: true,
        status: 'uncompleted',
        order: 0
      })
      .set(initialStep3.id, {
        active: false,
        status: 'uncompleted',
        order: 1
      })
      .set(initialStep4.id, {
        active: false,
        status: 'uncompleted',
        order: 2
      })
      .set(stepToAdd2.id, {
        active: false,
        status: 'uncompleted',
        order: 3
      })
  }

  const expectedState7 = {
    steps: emptyState.steps
      .set(initialStep1.id, {
        active: true,
        status: 'uncompleted',
        order: 1
      })
      .set(initialStep3.id, {
        active: false,
        status: 'uncompleted',
        order: 2
      })
      .set(initialStep4.id, {
        active: false,
        status: 'uncompleted',
        order: 3
      })
      .set(stepToAdd3.id, {
        active: false,
        status: 'uncompleted',
        order: 0
      })
  }

  const expectedState8 = {
    steps: emptyState.steps
      .set(initialStep5.id, {
        active: false,
        status: 'completed',
        order: 0
      })
      .set(initialStep6.id, {
        active: true,
        status: 'completed',
        order: 1
      })
  }

  const expectedState9 = {
    steps: emptyState.steps
      .set(initialStep1.id, {
        active: true,
        status: 'uncompleted',
        order: 0
      })
      .set(initialStep3.id, {
        active: false,
        status: 'uncompleted',
        order: 1
      })
      .set(initialStep4.id, {
        active: false,
        status: 'uncompleted',
        order: 3
      })
      .set(stepToAdd4.id, {
        active: false,
        status: 'uncompleted',
        order: 2
      })
  }

  describe.each`
    initializerArgs         | action                          | expectedState                       | expectedError
    ${emptyInitializerArgs} | ${{ type: '' }}                 | ${emptyState}                       | ${hookError}
    ${emptyInitializerArgs} | ${{ type: 'previousClicked' }}  | ${emptyState}                       | ${hookError}
    ${initializerArgs1}     | ${{ type: '' }}                 | ${expectedStateAfterInitialization} | ${null}
    ${initializerArgs2}     | ${{ type: '' }}                 | ${emptyState}                       | ${hookError}
    ${initializerArgs3}     | ${{ type: '' }}                 | ${emptyState}                       | ${hookError}
    ${initializerArgs3}     | ${{ type: 'stepperSubmitted' }} | ${emptyState}                       | ${hookError}
    ${initializerArgs1}     | ${{ type: 'stepCompleted' }}    | ${expectedStateAfterStepCompleted}  | ${null}
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

// ${'#id4'}           | ${[initialStep1, initialStep3, initialStep4]} | ${{ type: 'previousClicked' }}                                | ${expectedStateAfterPreviousClicked} | ${null}
// ${'#id4'}           | ${[initialStep1, initialStep3, initialStep4]} | ${{ type: 'stepFailed' }}                                     | ${expectedState4}                    | ${null}
// ${'#id1'}           | ${[initialStep1, initialStep3, initialStep4]} | ${{ type: 'stepAddedBefore', payload: { step: stepToAdd1 } }} | ${expectedState5}                    | ${null}
// ${'#id1'}           | ${[initialStep1, initialStep3, initialStep4]} | ${{ type: 'stepAddedBefore', payload: { step: stepToAdd2 } }} | ${expectedState6}                    | ${null}
// ${'#id1'}           | ${[initialStep1, initialStep3, initialStep4]} | ${{ type: 'stepAddedBefore', payload: { step: stepToAdd3 } }} | ${expectedState7}                    | ${null}
// ${'#id28'}          | ${[initialStep5, initialStep6]}               | ${{ type: 'stepperSubmitted' }}                               | ${expectedState8}                    | ${null}
// ${'#id1'}           | ${[initialStep1, initialStep3, initialStep4]} | ${{ type: 'stepAddedAfter', payload: { step: stepToAdd4 } }}  | ${expectedState9}                    | ${null}
