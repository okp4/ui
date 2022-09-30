import { StepperState } from 'hook/useStepper'
import { List as ImmutableList, OrderedMap } from 'immutable'
import { StepId, StepStatus } from 'ui/index'
import { Step } from '../Stepper'
import { getCurrentStep, getStepStatusByStepId, getUpdatedSteps } from './stepper.selector'

describe('Considering the getStepStatusByStepId function', () => {
  const emptyState: StepperState = {
    currentStepId: '',
    stepsStatus: OrderedMap(),
    enabledSteps: ImmutableList()
  }

  const state: StepperState = {
    currentStepId: 'step3',
    stepsStatus: OrderedMap<StepId, StepStatus>()
      .set('step1', 'completed')
      .set('step2', 'disabled')
      .set('step3', 'invalid')
      .set('step4', 'uncompleted')
      .set('step5', 'disabled')
      .set('step6', 'uncompleted'),
    enabledSteps: ImmutableList(['step1', 'step3', 'step4', 'step6'])
  }

  describe.each`
    stepId       | state         | expectedStatus
    ${undefined} | ${emptyState} | ${'uncompleted'}
    ${undefined} | ${state}      | ${'uncompleted'}
    ${''}        | ${state}      | ${'uncompleted'}
    ${'step1'}   | ${state}      | ${'completed'}
    ${'step2'}   | ${state}      | ${'disabled'}
    ${'step3'}   | ${state}      | ${'invalid'}
    ${'step4'}   | ${state}      | ${'uncompleted'}
    ${'step5'}   | ${state}      | ${'disabled'}
    ${'step6'}   | ${state}      | ${'uncompleted'}
  `(
    'Given a step id <$stepId> and a state',
    ({
      stepId,
      state,
      expectedStatus
    }: {
      stepId: StepId
      state: StepperState
      expectedStatus: OrderedMap<StepId, StepStatus>
    }) => {
      describe('When calling getStepStatusByStepId function', () => {
        const result = getStepStatusByStepId(stepId, state)

        test(`Then, expected status is ${JSON.stringify(expectedStatus)}`, () => {
          expect(result).toStrictEqual(expectedStatus)
        })
      })
    }
  )
})

describe('Considering the getUpdatedSteps function', () => {
  const steps: Step[] = [
    {
      id: 'step1',
      status: 'completed'
    },
    {
      id: 'step2',
      status: 'disabled'
    },
    {
      id: 'step3',
      status: 'invalid'
    },
    {
      id: 'step4'
    },
    {
      id: 'step5',
      status: 'disabled'
    },
    {
      id: 'step6'
    }
  ]

  const state: StepperState = {
    currentStepId: 'step4',
    stepsStatus: OrderedMap<StepId, StepStatus>()
      .set('step1', 'completed')
      .set('step2', 'disabled')
      .set('step3', 'completed')
      .set('step4', 'uncompleted')
      .set('step5', 'disabled')
      .set('step6', 'uncompleted'),
    enabledSteps: ImmutableList(['step1', 'step3', 'step4', 'step6'])
  }

  const updatedSteps: Step[] = [
    {
      id: 'step1',
      status: 'completed'
    },
    {
      id: 'step2',
      status: 'disabled'
    },
    {
      id: 'step3',
      status: 'completed'
    },
    {
      id: 'step4',
      status: 'uncompleted'
    },
    {
      id: 'step5',
      status: 'disabled'
    },
    {
      id: 'step6',
      status: 'uncompleted'
    }
  ]

  describe.each`
    steps    | state    | expectedSteps
    ${steps} | ${state} | ${updatedSteps}
  `(
    'Given a steps array <$steps> and a state',
    ({
      steps,
      state,
      expectedSteps
    }: {
      steps: Step[]
      state: StepperState
      expectedSteps: Step[]
    }) => {
      describe('When calling getUpdatedSteps function', () => {
        const result = getUpdatedSteps(steps, state)

        test(`Then, updated steps are ${expectedSteps}`, () => {
          expect(result).toStrictEqual(expectedSteps)
        })
      })
    }
  )
})

describe('Considering the getCurrentStep function', () => {
  const step1: Step = {
    id: 'step1',
    status: 'completed'
  }
  const step2: Step = {
    id: 'step2',
    status: 'disabled'
  }
  const step3: Step = {
    id: 'step3',
    status: 'invalid'
  }
  const step4: Step = {
    id: 'step4'
  }
  const step5: Step = {
    id: 'step5',
    status: 'disabled'
  }
  const step6: Step = {
    id: 'step6'
  }
  const steps: Step[] = [step1, step2, step3, step4, step5, step6]

  const state1: StepperState = {
    currentStepId: 'step3',
    stepsStatus: OrderedMap<StepId, StepStatus>()
      .set('step1', 'completed')
      .set('step2', 'disabled')
      .set('step3', 'completed')
      .set('step4', 'uncompleted')
      .set('step5', 'disabled')
      .set('step6', 'uncompleted'),
    enabledSteps: ImmutableList(['step1', 'step3', 'step4', 'step6'])
  }

  const state2: StepperState = {
    ...state1,
    currentStepId: 'step4'
  }

  const state3: StepperState = {
    ...state1,
    currentStepId: 'step6'
  }

  describe.each`
    steps    | state     | expectedStep
    ${steps} | ${state1} | ${step3}
    ${steps} | ${state2} | ${step4}
    ${steps} | ${state3} | ${step6}
  `(
    'Given a steps array <$steps> and a state',
    ({
      steps,
      state,
      expectedStep
    }: {
      steps: Step[]
      state: StepperState
      expectedStep: Step
    }) => {
      describe('When calling getCurrentStep function', () => {
        const result = getCurrentStep(steps, state)

        test(`Then, the expected step is ${JSON.stringify(expectedStep)}`, () => {
          expect(result).toStrictEqual(expectedStep)
        })
      })
    }
  )
})
