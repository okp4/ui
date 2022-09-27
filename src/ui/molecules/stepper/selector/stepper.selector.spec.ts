import { StepperState } from 'hook/useStepper'
import { OrderedMap, List as ImmutableList } from 'immutable'
import { StepId, StepStatus } from 'ui/index'
import { Step, StepIndex } from '../Stepper'
import {
  getCurrentStepIndex,
  getStepIndex,
  getStatusFromSteps,
  getStepsWithUpdatedStatus
} from './stepper.selector'

describe('Considering the getStatusFromSteps function', () => {
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

  const status: OrderedMap<StepId, StepStatus> = OrderedMap<StepId, StepStatus>()
    .set('step1', 'completed')
    .set('step2', 'disabled')
    .set('step3', 'invalid')
    .set('step4', 'uncompleted')
    .set('step5', 'disabled')
    .set('step6', 'uncompleted')

  describe.each`
    steps    | expectedResult
    ${steps} | ${status}
  `(
    'Given a value <$steps>',
    ({
      steps,
      expectedResult
    }: {
      steps: Step[]
      expectedResult: OrderedMap<StepId, StepStatus>
    }) => {
      describe('When calling function', () => {
        const result = getStatusFromSteps(steps)

        test(`Then, result value is ${expectedResult}`, () => {
          expect(result).toEqual(expectedResult)
        })
      })
    }
  )
})

describe('Considering the getStepsWithUpdatedStatus function', () => {
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
    currentStep: 'step4',
    stepStatus: OrderedMap<StepId, StepStatus>()
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
    steps    | state    | expectedResult
    ${steps} | ${state} | ${updatedSteps}
  `(
    'Given a value <$steps> and <$state>',
    ({
      steps,
      state,
      expectedResult
    }: {
      steps: Step[]
      state: StepperState
      expectedResult: Step[]
    }) => {
      describe('When calling function', () => {
        const result = getStepsWithUpdatedStatus(steps, state)

        test(`Then, result value is ${expectedResult}`, () => {
          expect(result).toEqual(expectedResult)
        })
      })
    }
  )
})

describe('Considering the getStepIndex function', () => {
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

  describe.each`
    steps    | id         | expectedResult
    ${steps} | ${'step1'} | ${0}
    ${steps} | ${'step2'} | ${1}
    ${steps} | ${'step3'} | ${2}
    ${steps} | ${'step4'} | ${3}
    ${steps} | ${'step5'} | ${4}
    ${steps} | ${'step6'} | ${5}
  `(
    'Given a value <$steps> and <$id>',
    ({ steps, id, expectedResult }: { steps: Step[]; id: StepId; expectedResult: StepIndex }) => {
      describe('When calling function', () => {
        const result = getStepIndex(steps, id)

        test(`Then, result value is ${expectedResult}`, () => {
          expect(result).toEqual(expectedResult)
        })
      })
    }
  )
})

describe('Considering the getCurrentStepIndex function', () => {
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

  const state1: StepperState = {
    currentStep: 'step3',
    stepStatus: OrderedMap<StepId, StepStatus>()
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
    currentStep: 'step4'
  }

  const state3: StepperState = {
    ...state1,
    currentStep: 'step6'
  }

  describe.each`
    steps    | state     | expectedResult
    ${steps} | ${state1} | ${2}
    ${steps} | ${state2} | ${3}
    ${steps} | ${state3} | ${5}
  `(
    'Given a value <$steps> and <$state>',
    ({
      steps,
      state,
      expectedResult
    }: {
      steps: Step[]
      state: StepperState
      expectedResult: StepIndex
    }) => {
      describe('When calling function', () => {
        const result = getCurrentStepIndex(steps, state)

        test(`Then, result value is ${expectedResult}`, () => {
          expect(result).toEqual(expectedResult)
        })
      })
    }
  )
})
