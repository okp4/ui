import { List as ImmutableList, OrderedMap } from 'immutable'
import type { StepId, StepStatus } from 'ui/index'
import type { StepperState } from './useStepper'
import { useStepper } from './useStepper'
import { act } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'

describe('Considering the stepperReducer function', () => {
  const previousClicked = 'previousClicked'
  const stepCompleted = 'stepCompleted'
  const stepFailed = 'stepFailed'
  const stepperSubmitted = 'stepperSubmitted'
  const stepperReseted = 'stepperReseted'

  const emptyState: StepperState = {
    currentStep: '',
    enabledSteps: ImmutableList(),
    stepStatus: OrderedMap()
  }

  const stepStatus1 = OrderedMap<StepId, StepStatus>()
    .set('step1', 'uncompleted')
    .set('step2', 'uncompleted')
    .set('step3', 'uncompleted')

  const state1_stepCompleted: StepperState = {
    currentStep: 'step2',
    stepStatus: OrderedMap<StepId, StepStatus>()
      .set('step1', 'completed')
      .set('step2', 'uncompleted')
      .set('step3', 'uncompleted'),
    enabledSteps: ImmutableList(['step1', 'step2', 'step3'])
  }

  const state1_stepFailed = {
    currentStep: 'step1',
    stepStatus: OrderedMap<StepId, StepStatus>()
      .set('step1', 'invalid')
      .set('step2', 'uncompleted')
      .set('step3', 'uncompleted'),
    enabledSteps: ImmutableList(['step1', 'step2', 'step3'])
  }

  const stepStatus2 = OrderedMap<StepId, StepStatus>()
    .set('firstStep', 'completed')
    .set('secondStep', 'uncompleted')
    .set('thirdStep', 'disabled')
    .set('fourthStep', 'uncompleted')

  const state2_previousClicked = {
    currentStep: 'firstStep',
    stepStatus: OrderedMap<StepId, StepStatus>()
      .set('firstStep', 'completed')
      .set('secondStep', 'uncompleted')
      .set('thirdStep', 'disabled')
      .set('fourthStep', 'uncompleted'),
    enabledSteps: ImmutableList(['firstStep', 'secondStep', 'fourthStep'])
  }

  const state2_stepCompleted = {
    currentStep: 'fourthStep',
    stepStatus: OrderedMap<StepId, StepStatus>()
      .set('firstStep', 'completed')
      .set('secondStep', 'completed')
      .set('thirdStep', 'disabled')
      .set('fourthStep', 'uncompleted'),
    enabledSteps: ImmutableList(['firstStep', 'secondStep', 'fourthStep'])
  }

  const stepStatus3 = OrderedMap<StepId, StepStatus>()
    .set('firstStep', 'disabled')
    .set('secondStep', 'uncompleted')
    .set('thirdStep', 'uncompleted')
    .set('fourthStep', 'uncompleted')
    .set('fifthStep', 'disabled')

  const state3_previousClicked = {
    currentStep: 'secondStep',
    stepStatus: OrderedMap<StepId, StepStatus>()
      .set('firstStep', 'disabled')
      .set('secondStep', 'uncompleted')
      .set('thirdStep', 'uncompleted')
      .set('fourthStep', 'uncompleted')
      .set('fifthStep', 'disabled'),
    enabledSteps: ImmutableList(['secondStep', 'thirdStep', 'fourthStep'])
  }

  const state3_stepCompleted = {
    currentStep: 'fourthStep',
    stepStatus: OrderedMap<StepId, StepStatus>()
      .set('firstStep', 'disabled')
      .set('secondStep', 'uncompleted')
      .set('thirdStep', 'completed')
      .set('fourthStep', 'uncompleted')
      .set('fifthStep', 'disabled'),
    enabledSteps: ImmutableList(['secondStep', 'thirdStep', 'fourthStep'])
  }

  const stepStatus4 = OrderedMap<StepId, StepStatus>()
    .set('step1', 'completed')
    .set('step2', 'completed')
    .set('step3', 'uncompleted')

  const state4_stepperSubmitted: StepperState = {
    currentStep: 'step3',
    stepStatus: OrderedMap<StepId, StepStatus>()
      .set('step1', 'completed')
      .set('step2', 'completed')
      .set('step3', 'completed'),
    enabledSteps: ImmutableList(['step1', 'step2', 'step3'])
  }

  const state4_initializerArgs = {
    initialActiveStep: 'step1',
    initialStatus: OrderedMap<StepId, StepStatus>()
      .set('step1', 'uncompleted')
      .set('step2', 'uncompleted')
      .set('step3', 'uncompleted')
  }

  const state4_stepperReseted: StepperState = {
    currentStep: 'step1',
    stepStatus: OrderedMap<StepId, StepStatus>()
      .set('step1', 'uncompleted')
      .set('step2', 'uncompleted')
      .set('step3', 'uncompleted'),
    enabledSteps: ImmutableList(['step1', 'step2', 'step3'])
  }

  describe.each`
    current         | status          | type                | payload                   | expectedResult
    ${''}           | ${OrderedMap()} | ${undefined}        | ${undefined}              | ${emptyState}
    ${'step1'}      | ${stepStatus1}  | ${stepCompleted}    | ${undefined}              | ${state1_stepCompleted}
    ${'step1'}      | ${stepStatus1}  | ${stepFailed}       | ${undefined}              | ${state1_stepFailed}
    ${'secondStep'} | ${stepStatus2}  | ${previousClicked}  | ${undefined}              | ${state2_previousClicked}
    ${'secondStep'} | ${stepStatus2}  | ${stepCompleted}    | ${undefined}              | ${state2_stepCompleted}
    ${'thirdStep'}  | ${stepStatus3}  | ${previousClicked}  | ${undefined}              | ${state3_previousClicked}
    ${'thirdStep'}  | ${stepStatus3}  | ${stepCompleted}    | ${undefined}              | ${state3_stepCompleted}
    ${'step3'}      | ${stepStatus4}  | ${stepperSubmitted} | ${undefined}              | ${state4_stepperSubmitted}
    ${'step3'}      | ${stepStatus4}  | ${stepperReseted}   | ${state4_initializerArgs} | ${state4_stepperReseted}
  `(
    'Given a value <$current> and <$status> and dispatch action of type <$type> with payload <$payload>',
    ({
      current,
      status,
      type,
      payload,
      expectedResult
    }: {
      current: StepId
      status: OrderedMap<StepId, StepStatus>
      type: any
      payload: any
      expectedResult: StepperState
    }) => {
      describe('When calling function', () => {
        test('Test useStepper', () => {
          const { result } = renderHook(() => useStepper(current, status))
          act(() => {
            result.current.dispatch({ type, payload })
          })
          expect(result.current.state).toEqual(expectedResult)
        })
      })
    }
  )
})
