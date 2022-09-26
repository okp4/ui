import { StepId, StepStatus } from 'ui/index'
import { StepperState, StepperAction, stepperReducer } from './useStepper'
import { List as ImmutableList, OrderedMap } from 'immutable'

describe('Considering the stepperReducer function', () => {
  const previousClicked = 'previousClicked'
  const stepCompleted = 'stepCompleted'
  const stepFailed = 'stepFailed'
  const stepperSubmitted = 'stepperSubmitted'
  const stepperReseted = 'stepperReseted'

  const state1: StepperState = {
    currentStep: 'step1',
    stepStatus: OrderedMap<StepId, StepStatus>()
      .set('step1', 'uncompleted')
      .set('step2', 'uncompleted')
      .set('step3', 'uncompleted'),
    enabledSteps: ImmutableList(['step1', 'step2', 'step3']),
    isAnyPreviousStepEnabled: false,
    isAnyNextStepEnabled: true
  }

  const state1_stepCompleted: StepperState = {
    ...state1,
    currentStep: 'step2',
    stepStatus: OrderedMap<StepId, StepStatus>()
      .set('step1', 'completed')
      .set('step2', 'uncompleted')
      .set('step3', 'uncompleted'),
    isAnyPreviousStepEnabled: true
  }

  const state1_stepFailed = {
    ...state1,
    stepStatus: OrderedMap<StepId, StepStatus>()
      .set('step1', 'invalid')
      .set('step2', 'uncompleted')
      .set('step3', 'uncompleted')
  }

  const state2: StepperState = {
    currentStep: 'secondStep',
    stepStatus: OrderedMap<StepId, StepStatus>()
      .set('firstStep', 'completed')
      .set('secondStep', 'uncompleted')
      .set('thirdStep', 'disabled')
      .set('fourthStep', 'uncompleted'),
    enabledSteps: ImmutableList(['firstStep', 'secondStep', 'fourthStep']),
    isAnyPreviousStepEnabled: true,
    isAnyNextStepEnabled: true
  }

  const state2_previousClicked = {
    ...state2,
    currentStep: 'firstStep',
    isAnyPreviousStepEnabled: false
  }

  const state2_stepCompleted = {
    ...state2,
    currentStep: 'fourthStep',
    stepStatus: OrderedMap<StepId, StepStatus>()
      .set('firstStep', 'completed')
      .set('secondStep', 'completed')
      .set('thirdStep', 'disabled')
      .set('fourthStep', 'uncompleted'),
    isAnyNextStepEnabled: false
  }

  const state3: StepperState = {
    currentStep: 'thirdStep',
    stepStatus: OrderedMap<StepId, StepStatus>()
      .set('firstStep', 'disabled')
      .set('secondStep', 'uncompleted')
      .set('thirdStep', 'uncompleted')
      .set('fourthStep', 'uncompleted')
      .set('fifthStep', 'disabled'),
    enabledSteps: ImmutableList(['secondStep', 'thirdStep', 'fourthStep']),
    isAnyPreviousStepEnabled: true,
    isAnyNextStepEnabled: true
  }

  const state3_previousClicked = {
    ...state3,
    currentStep: 'secondStep',
    isAnyPreviousStepEnabled: false
  }

  const state3_stepCompleted = {
    ...state3,
    currentStep: 'fourthStep',
    stepStatus: OrderedMap<StepId, StepStatus>()
      .set('firstStep', 'disabled')
      .set('secondStep', 'uncompleted')
      .set('thirdStep', 'completed')
      .set('fourthStep', 'uncompleted')
      .set('fifthStep', 'disabled'),
    isAnyNextStepEnabled: false
  }

  const state4: StepperState = {
    currentStep: 'step3',
    stepStatus: OrderedMap<StepId, StepStatus>()
      .set('step1', 'completed')
      .set('step2', 'completed')
      .set('step3', 'uncompleted'),
    enabledSteps: ImmutableList(['step1', 'step2', 'step3']),
    isAnyPreviousStepEnabled: true,
    isAnyNextStepEnabled: false
  }

  const state4_stepperSubmitted: StepperState = {
    currentStep: 'step3',
    stepStatus: OrderedMap<StepId, StepStatus>()
      .set('step1', 'completed')
      .set('step2', 'completed')
      .set('step3', 'completed'),
    enabledSteps: ImmutableList(['step1', 'step2', 'step3']),
    isAnyPreviousStepEnabled: true,
    isAnyNextStepEnabled: false
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
    enabledSteps: ImmutableList(['step1', 'step2', 'step3']),
    isAnyPreviousStepEnabled: false,
    isAnyNextStepEnabled: true
  }

  const state3_fourthStepRemoved: StepperState = {
    ...state3,
    stepStatus: OrderedMap<StepId, StepStatus>()
      .set('firstStep', 'disabled')
      .set('secondStep', 'uncompleted')
      .set('thirdStep', 'uncompleted')
      .set('fifthStep', 'disabled'),
    enabledSteps: ImmutableList(['secondStep', 'thirdStep']),
    isAnyNextStepEnabled: false
  }

  describe.each`
    state     | type                | payload                   | expectedResult
    ${state1} | ${stepCompleted}    | ${undefined}              | ${state1_stepCompleted}
    ${state1} | ${stepFailed}       | ${undefined}              | ${state1_stepFailed}
    ${state2} | ${previousClicked}  | ${undefined}              | ${state2_previousClicked}
    ${state2} | ${stepCompleted}    | ${undefined}              | ${state2_stepCompleted}
    ${state3} | ${previousClicked}  | ${undefined}              | ${state3_previousClicked}
    ${state3} | ${stepCompleted}    | ${undefined}              | ${state3_stepCompleted}
    ${state4} | ${stepperSubmitted} | ${undefined}              | ${state4_stepperSubmitted}
    ${state4} | ${stepperReseted}   | ${state4_initializerArgs} | ${state4_stepperReseted}
  `(
    'Given a value <$state> and dispatch action of type <$type> and payload <$payload>',
    ({
      state,
      type,
      payload,
      expectedResult
    }: {
      state: StepperState
      type: any
      payload: any
      expectedResult: StepperState
    }) => {
      describe('When calling function', () => {
        const result = stepperReducer(state, { type: type, payload })

        test(`Then, result value is ${expectedResult}`, () => {
          expect(result).toEqual(expectedResult)
        })
      })
    }
  )
})
