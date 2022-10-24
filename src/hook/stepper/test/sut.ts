import type { InitializerArgs, Step, StepperState } from '../useStepper'
import { Map } from 'immutable'

/**
 * Hook Error
 */

export const hookError = new Error(
  'Intial state is invalid, check the parameters provided to the hook'
)

/**
 * Empty elements
 */

export const emptyState: StepperState = {
  steps: Map<string, Step>(),
  initialSteps: Map<string, Step>()
}

export const emptyInitializerArgs: InitializerArgs = {
  initialSteps: []
}

/**
 * Initializer Arguments
 */

export const initializerArgs1: InitializerArgs = {
  initialActiveStepId: '#id1',
  initialSteps: [
    {
      id: '#id1',
      status: 'uncompleted'
    },
    {
      id: '#id2',
      status: 'uncompleted'
    }
  ]
}

export const initializerArgs2: InitializerArgs = {
  initialActiveStepId: '#id1',
  initialSteps: [
    {
      id: '#id1',
      status: 'uncompleted'
    },
    {
      id: '',
      status: 'uncompleted'
    }
  ]
}

export const initializerArgs3: InitializerArgs = {
  initialActiveStepId: '#id1',
  initialSteps: [
    {
      id: '#id1',
      status: 'uncompleted'
    },
    {
      id: '#id1',
      status: 'uncompleted'
    }
  ]
}

/**
 * Expected states
 */

// After first state initialization
const stepsAfterFirstInitialization = emptyState.steps
  .set('#id1', {
    active: true,
    status: 'uncompleted',
    order: 0
  })
  .set('#id2', {
    active: false,
    status: 'uncompleted',
    order: 1
  })

export const expectedStateAfterInitialization: StepperState = {
  steps: stepsAfterFirstInitialization,
  initialSteps: stepsAfterFirstInitialization
}

// After "StepCompleted" action dispatched
const stepsAfterStepCompleted = emptyState.steps
  .set('#id1', {
    active: false,
    status: 'completed',
    order: 0
  })
  .set('#id2', {
    active: true,
    status: 'uncompleted',
    order: 1
  })
export const expectedStateAfterStepCompleted: StepperState = {
  steps: stepsAfterStepCompleted,
  initialSteps: stepsAfterFirstInitialization
}
