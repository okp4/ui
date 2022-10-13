import { StepperState } from 'hook/useStepper'
import { List as ImmutableList, OrderedMap } from 'immutable'
import { StepId, StepStatus } from 'ui/index'
import { Step } from '../Stepper'
import { getUpdatedSteps } from './stepper.selector'

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
    nonDisabledSteps: ImmutableList(['step1', 'step3', 'step4', 'step6'])
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
    'Given a steps array and a state <$state>',
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

        test(`Then, updated steps are ${JSON.stringify(expectedSteps)}`, () => {
          expect(result).toStrictEqual(expectedSteps)
        })
      })
    }
  )
})
