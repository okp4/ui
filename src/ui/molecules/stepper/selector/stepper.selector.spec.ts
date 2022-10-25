import { StepperState, StepData as StepState } from 'hook/stepper/useStepper'
import { List as ImmutableList, Map, OrderedMap } from 'immutable'
import { StepId, StepStatus } from 'ui/index'
import { Step } from '../Stepper'
import { getActiveStepId, getUpdatedSteps } from './stepper.selector'

type Data = {
  steps: Step[]
  state: StepperState
  expectedUpdatedSteps: Step[]
}

describe('Considering the getUpdatedSteps selector', () => {
  const steps1: Step[] = [
    {
      id: '#id1',
      status: 'completed'
    },
    {
      id: '#id2',
      status: 'disabled'
    },
    {
      id: '#id3',
      status: 'invalid'
    },
    {
      id: '#id4'
    },
    {
      id: '#id5',
      status: 'disabled'
    },
    {
      id: '#id6'
    }
  ]

  const state1: StepperState = {
    steps: Map<string, StepState>()
      .set('#id1', { order: 0, status: 'completed', active: false })
      .set('#id2', { order: 1, status: 'disabled', active: false })
      .set('#id3', { order: 2, status: 'completed', active: false })
      .set('#id4', { order: 3, status: 'uncompleted', active: true })
      .set('#id5', { order: 4, status: 'disabled', active: false })
      .set('#id6', { order: 5, status: 'uncompleted', active: false }),
    initialSteps: Map<string, StepState>()
  }

  const updatedSteps1: Step[] = [
    {
      id: '#id1',
      status: 'completed'
    },
    {
      id: '#id2',
      status: 'disabled'
    },
    {
      id: '#id3',
      status: 'completed'
    },
    {
      id: '#id4',
      status: 'uncompleted'
    },
    {
      id: '#id5',
      status: 'disabled'
    },
    {
      id: '#id6',
      status: 'uncompleted'
    }
  ]

  const steps2: Step[] = [
    {
      id: '#id1',
      status: 'completed'
    },
    {
      id: '#id2',
      status: 'disabled'
    },
    {
      id: '#id3',
      status: 'invalid'
    },
    {
      id: '#id4'
    },
    {
      id: '#id4bis'
    },
    {
      id: '#id5',
      status: 'disabled'
    },
    {
      id: '#id6'
    }
  ]
  const state2: StepperState = {
    steps: Map<string, StepState>()
      .set('#id1', { order: 0, status: 'completed', active: false })
      .set('#id2', { order: 1, status: 'disabled', active: false })
      .set('#id3', { order: 2, status: 'completed', active: false })
      .set('#id4', { order: 3, status: 'uncompleted', active: false })
      .set('#id5', { order: 5, status: 'disabled', active: false })
      .set('#id6', { order: 6, status: 'uncompleted', active: false })
      .set('#id4bis', { order: 4, status: 'uncompleted', active: true }),
    initialSteps: Map<string, StepState>()
  }

  const updatedSteps2: Step[] = [
    {
      id: '#id1',
      status: 'completed'
    },
    {
      id: '#id2',
      status: 'disabled'
    },
    {
      id: '#id3',
      status: 'completed'
    },
    {
      id: '#id4',
      status: 'uncompleted'
    },
    {
      id: '#id4bis',
      status: 'uncompleted'
    },
    {
      id: '#id5',
      status: 'disabled'
    },
    {
      id: '#id6',
      status: 'uncompleted'
    }
  ]

  describe.each`
    steps     | state     | expectedUpdatedSteps
    ${steps1} | ${state1} | ${updatedSteps1}
    ${steps2} | ${state2} | ${updatedSteps2}
  `('Given a steps array and a state <$state>', ({ steps, state, expectedUpdatedSteps }: Data) => {
    describe('When invoking getUpdatedSteps selector', () => {
      const result = getUpdatedSteps(steps, state)

      test(`Then, expect updated steps to be ${JSON.stringify(expectedUpdatedSteps)}`, () => {
        expect(result).toStrictEqual(expectedUpdatedSteps)
      })
    })
  })
})

describe('Considering the getActiveStepId selector', () => {
  const state1: StepperState = {
    steps: Map<string, StepState>()
      .set('#id1', { order: 0, status: 'completed', active: false })
      .set('#id2', { order: 1, status: 'disabled', active: true })
      .set('#id3', { order: 2, status: 'completed', active: false })
      .set('#id4', { order: 3, status: 'uncompleted', active: false }),
    initialSteps: Map<string, StepState>()
  }

  const state2: StepperState = {
    steps: Map<string, StepState>()
      .set('#id1', { order: 0, status: 'completed', active: false })
      .set('#id2', { order: 1, status: 'disabled', active: false })
      .set('#id3', { order: 2, status: 'completed', active: false })
      .set('#id4', { order: 3, status: 'uncompleted', active: false }),
    initialSteps: Map<string, StepState>()
  }

  const state3: StepperState = {
    steps: Map<string, StepState>()
      .set('#id1', { order: 0, status: 'completed', active: true })
      .set('#id2', { order: 1, status: 'disabled', active: false })
      .set('#id3', { order: 2, status: 'completed', active: true })
      .set('#id4', { order: 3, status: 'uncompleted', active: false }),
    initialSteps: Map<string, StepState>()
  }

  describe.each`
    state     | expectedActiveStepId
    ${state1} | ${'#id2'}
    ${state2} | ${undefined}
    ${state3} | ${'#id1'}
  `(
    'Given a state <$state>',
    ({ state, expectedActiveStepId }: { state: StepperState; expectedActiveStepId: string }) => {
      describe('When invoking getActiveStepId selector', () => {
        const result = getActiveStepId(state)

        test(`Then, expect active step id to be ${expectedActiveStepId}`, () => {
          expect(result).toStrictEqual(expectedActiveStepId)
        })
      })
    }
  )
})
