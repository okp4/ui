import type {
  InitializerArgs,
  InitialStep,
  StepData,
  StepperState,
  StepWithAfterOrder,
  StepWithBeforeOrder
} from '../useStepper'
import { Map } from 'immutable'

/**
 * Hook Error
 */

export const hookError = new Error(
  'Intial state is invalid, check the parameters provided to the hook.'
)

/**
 * Empty elements
 */

export const emptyState: StepperState = {
  steps: Map<string, StepData>(),
  initialSteps: Map<string, StepData>()
}

export const emptyInitializerArgs: InitializerArgs = {
  initialSteps: []
}

/**
 * Initial steps
 */

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
const initialStepCompleted: InitialStep = {
  id: '#id27',
  status: 'completed'
}
const initialStepDisabled: InitialStep = {
  id: '#id28',
  status: 'disabled'
}
const initialStep5: InitialStep = {
  id: '#id5',
  status: 'uncompleted'
}
const initialStepInvalid: InitialStep = {
  id: '#id29',
  status: 'invalid'
}

/**
 * Steps to add
 */

export const stepToAdd1: StepWithBeforeOrder = {
  id: '#id11',
  beforeOrder: 1,
  status: 'uncompleted'
}
export const stepToAdd2: StepWithBeforeOrder = {
  id: '#id12',
  beforeOrder: 12,
  status: 'uncompleted'
}
export const stepToAdd3: StepWithBeforeOrder = {
  id: '#id13',
  beforeOrder: -1,
  status: 'uncompleted'
}
export const stepToAdd4: StepWithAfterOrder = {
  id: '#id14',
  afterOrder: 1,
  status: 'uncompleted'
}
export const stepToAdd5: StepWithAfterOrder = {
  id: '#id15',
  afterOrder: 15,
  status: 'uncompleted'
}
export const stepToAdd6: StepWithAfterOrder = {
  id: '#id16',
  afterOrder: -1,
  status: 'uncompleted'
}

/**
 * Initializer Arguments
 */

export const initializerArgs1: InitializerArgs = {
  initialActiveStepId: '#id1',
  initialSteps: [initialStep1, initialStep3]
}

export const initializerArgs2: InitializerArgs = {
  initialActiveStepId: '#id1',
  initialSteps: [initialStep1, initialStep2]
}

export const initializerArgs3: InitializerArgs = {
  initialActiveStepId: '#id1',
  initialSteps: [initialStep1, initialStep1]
}

export const initializerArgs4: InitializerArgs = {
  initialActiveStepId: '#id4',
  initialSteps: [
    initialStepCompleted,
    initialStep3,
    initialStepDisabled,
    initialStep4,
    initialStep5
  ]
}

export const initializerArgs5: InitializerArgs = {
  initialActiveStepId: '#id4',
  initialSteps: [initialStep3, initialStepDisabled, initialStep4, initialStep5]
}

export const initializerArgs6: InitializerArgs = {
  initialActiveStepId: '#id3',
  initialSteps: [initialStep3, initialStepDisabled, initialStep4, initialStep5]
}

export const initializerArgs7: InitializerArgs = {
  initialActiveStepId: '#id29',
  initialSteps: [initialStep3, initialStep4, initialStepInvalid, initialStep5]
}

export const initializerArgs8: InitializerArgs = {
  initialSteps: [initialStep3, initialStepDisabled, initialStep4, initialStep5]
}

/**
 * Expected states
 */

const stepsAfterFirstInitialization = emptyState.initialSteps
  .set('#id27', {
    active: false,
    status: 'completed',
    order: 0
  })
  .set('#id3', {
    active: false,
    status: 'uncompleted',
    order: 1
  })
  .set('#id28', {
    active: false,
    status: 'disabled',
    order: 2
  })
  .set('#id4', {
    active: true,
    status: 'uncompleted',
    order: 3
  })
  .set('#id5', {
    active: false,
    status: 'uncompleted',
    order: 4
  })

export const expectedStateAfterFirstInitialization: StepperState = {
  steps: stepsAfterFirstInitialization,
  initialSteps: stepsAfterFirstInitialization
}

// After "StepCompleted" action dispatched

export const expectedStateAfterStepCompleted1: StepperState = {
  steps: emptyState.steps
    .set('#id1', {
      active: false,
      status: 'completed',
      order: 0
    })
    .set('#id3', {
      active: true,
      status: 'uncompleted',
      order: 1
    }),
  initialSteps: emptyState.initialSteps
    .set('#id1', {
      active: true,
      status: 'uncompleted',
      order: 0
    })
    .set('#id3', {
      active: false,
      status: 'uncompleted',
      order: 1
    })
}

export const expectedStateAfterStepCompleted4: StepperState = {
  steps: emptyState.steps
    .set('#id27', {
      active: false,
      status: 'completed',
      order: 0
    })
    .set('#id3', {
      active: false,
      status: 'uncompleted',
      order: 1
    })
    .set('#id28', {
      active: false,
      status: 'disabled',
      order: 2
    })
    .set('#id4', {
      active: false,
      status: 'completed',
      order: 3
    })
    .set('#id5', {
      active: true,
      status: 'uncompleted',
      order: 4
    }),
  initialSteps: stepsAfterFirstInitialization
}

export const expectedStateAfterStepCompleted6: StepperState = {
  steps: emptyState.steps
    .set('#id3', {
      active: false,
      status: 'completed',
      order: 0
    })
    .set('#id28', {
      active: false,
      status: 'disabled',
      order: 1
    })
    .set('#id4', {
      active: true,
      status: 'uncompleted',
      order: 2
    })
    .set('#id5', {
      active: false,
      status: 'uncompleted',
      order: 3
    }),
  initialSteps: emptyState.initialSteps
    .set('#id3', {
      active: true,
      status: 'uncompleted',
      order: 0
    })
    .set('#id28', {
      active: false,
      status: 'disabled',
      order: 1
    })
    .set('#id4', {
      active: false,
      status: 'uncompleted',
      order: 2
    })
    .set('#id5', {
      active: false,
      status: 'uncompleted',
      order: 3
    })
}

// After "StepFailed" action dispatched
const stepsAfterStepFailed = emptyState.steps
  .set('#id27', {
    active: false,
    status: 'completed',
    order: 0
  })
  .set('#id3', {
    active: false,
    status: 'uncompleted',
    order: 1
  })
  .set('#id28', {
    active: false,
    status: 'disabled',
    order: 2
  })
  .set('#id4', {
    active: true,
    status: 'invalid',
    order: 3
  })
  .set('#id5', {
    active: false,
    status: 'uncompleted',
    order: 4
  })
export const expectedStateAfterStepFailed: StepperState = {
  steps: stepsAfterStepFailed,
  initialSteps: stepsAfterFirstInitialization
}

// After "PreviousClicked" action dispatched
const stepsAfterPreviousClicked = emptyState.steps
  .set('#id27', {
    active: false,
    status: 'completed',
    order: 0
  })
  .set('#id3', {
    active: true,
    status: 'uncompleted',
    order: 1
  })
  .set('#id28', {
    active: false,
    status: 'disabled',
    order: 2
  })
  .set('#id4', {
    active: false,
    status: 'uncompleted',
    order: 3
  })
  .set('#id5', {
    active: false,
    status: 'uncompleted',
    order: 4
  })
export const expectedStateAfterPreviousClicked: StepperState = {
  steps: stepsAfterPreviousClicked,
  initialSteps: stepsAfterFirstInitialization
}

const stepsAfterPreviousClicked5 = emptyState.steps
  .set('#id3', {
    active: true,
    status: 'uncompleted',
    order: 0
  })
  .set('#id28', {
    active: false,
    status: 'disabled',
    order: 1
  })
  .set('#id4', {
    active: false,
    status: 'uncompleted',
    order: 2
  })
  .set('#id5', {
    active: false,
    status: 'uncompleted',
    order: 3
  })
export const expectedStateAfterPreviousClicked5: StepperState = {
  steps: stepsAfterPreviousClicked5,
  initialSteps: emptyState.steps
    .set('#id3', {
      active: false,
      status: 'uncompleted',
      order: 0
    })
    .set('#id28', {
      active: false,
      status: 'disabled',
      order: 1
    })
    .set('#id4', {
      active: true,
      status: 'uncompleted',
      order: 2
    })
    .set('#id5', {
      active: false,
      status: 'uncompleted',
      order: 3
    })
}

const stepsAfterPreviousClicked7 = emptyState.steps
  .set('#id3', {
    active: false,
    status: 'uncompleted',
    order: 0
  })
  .set('#id4', {
    active: true,
    status: 'uncompleted',
    order: 1
  })
  .set('#id29', {
    active: false,
    status: 'invalid',
    order: 2
  })
  .set('#id5', {
    active: false,
    status: 'uncompleted',
    order: 3
  })
export const expectedStateAfterPreviousClicked7: StepperState = {
  steps: stepsAfterPreviousClicked7,
  initialSteps: emptyState.steps
    .set('#id3', {
      active: false,
      status: 'uncompleted',
      order: 0
    })
    .set('#id4', {
      active: false,
      status: 'uncompleted',
      order: 1
    })
    .set('#id29', {
      active: true,
      status: 'invalid',
      order: 2
    })
    .set('#id5', {
      active: false,
      status: 'uncompleted',
      order: 3
    })
}

// After "StepAdded" action dispatched

const stepsAfterStepAdded1 = emptyState.steps
  .set('#id27', {
    active: false,
    status: 'completed',
    order: 0
  })
  .set('#id11', {
    active: false,
    status: 'uncompleted',
    order: 1
  })
  .set('#id3', {
    active: false,
    status: 'uncompleted',
    order: 2
  })
  .set('#id28', {
    active: false,
    status: 'disabled',
    order: 3
  })
  .set('#id4', {
    active: true,
    status: 'uncompleted',
    order: 4
  })
  .set('#id5', {
    active: false,
    status: 'uncompleted',
    order: 5
  })
export const expectedStateAfterStepAdded1: StepperState = {
  steps: stepsAfterStepAdded1,
  initialSteps: stepsAfterFirstInitialization
}

const stepsAfterStepAdded2 = emptyState.steps
  .set('#id27', {
    active: false,
    status: 'completed',
    order: 0
  })

  .set('#id3', {
    active: false,
    status: 'uncompleted',
    order: 1
  })
  .set('#id28', {
    active: false,
    status: 'disabled',
    order: 2
  })
  .set('#id4', {
    active: true,
    status: 'uncompleted',
    order: 3
  })
  .set('#id5', {
    active: false,
    status: 'uncompleted',
    order: 4
  })
  .set('#id12', {
    active: false,
    status: 'uncompleted',
    order: 5
  })
export const expectedStateAfterStepAdded2: StepperState = {
  steps: stepsAfterStepAdded2,
  initialSteps: stepsAfterFirstInitialization
}

const stepsAfterStepAdded3 = emptyState.steps
  .set('#id13', {
    active: false,
    status: 'uncompleted',
    order: 0
  })
  .set('#id27', {
    active: false,
    status: 'completed',
    order: 1
  })

  .set('#id3', {
    active: false,
    status: 'uncompleted',
    order: 2
  })
  .set('#id28', {
    active: false,
    status: 'disabled',
    order: 3
  })
  .set('#id4', {
    active: true,
    status: 'uncompleted',
    order: 4
  })
  .set('#id5', {
    active: false,
    status: 'uncompleted',
    order: 5
  })
export const expectedStateAfterStepAdded3: StepperState = {
  steps: stepsAfterStepAdded3,
  initialSteps: stepsAfterFirstInitialization
}

const stepsAfterStepAdded4 = emptyState.steps
  .set('#id27', {
    active: false,
    status: 'completed',
    order: 0
  })

  .set('#id3', {
    active: false,
    status: 'uncompleted',
    order: 1
  })
  .set('#id14', {
    active: false,
    status: 'uncompleted',
    order: 2
  })
  .set('#id28', {
    active: false,
    status: 'disabled',
    order: 3
  })
  .set('#id4', {
    active: true,
    status: 'uncompleted',
    order: 4
  })
  .set('#id5', {
    active: false,
    status: 'uncompleted',
    order: 5
  })
export const expectedStateAfterStepAdded4: StepperState = {
  steps: stepsAfterStepAdded4,
  initialSteps: stepsAfterFirstInitialization
}

const stepsAfterStepAdded5 = emptyState.steps
  .set('#id27', {
    active: false,
    status: 'completed',
    order: 0
  })
  .set('#id3', {
    active: false,
    status: 'uncompleted',
    order: 1
  })
  .set('#id28', {
    active: false,
    status: 'disabled',
    order: 2
  })
  .set('#id4', {
    active: true,
    status: 'uncompleted',
    order: 3
  })
  .set('#id5', {
    active: false,
    status: 'uncompleted',
    order: 4
  })
  .set('#id15', {
    active: false,
    status: 'uncompleted',
    order: 5
  })
export const expectedStateAfterStepAdded5: StepperState = {
  steps: stepsAfterStepAdded5,
  initialSteps: stepsAfterFirstInitialization
}

const stepsAfterStepAdded6 = emptyState.steps
  .set('#id16', {
    active: false,
    status: 'uncompleted',
    order: 0
  })
  .set('#id27', {
    active: false,
    status: 'completed',
    order: 1
  })
  .set('#id3', {
    active: false,
    status: 'uncompleted',
    order: 2
  })
  .set('#id28', {
    active: false,
    status: 'disabled',
    order: 3
  })
  .set('#id4', {
    active: true,
    status: 'uncompleted',
    order: 4
  })
  .set('#id5', {
    active: false,
    status: 'uncompleted',
    order: 5
  })

export const expectedStateAfterStepAdded6: StepperState = {
  steps: stepsAfterStepAdded6,
  initialSteps: stepsAfterFirstInitialization
}

// After "StepperSubmitted" action dispatched

const stepsAfterStepperSubmitted = emptyState.steps
  .set('#id27', {
    active: false,
    status: 'completed',
    order: 0
  })
  .set('#id3', {
    active: false,
    status: 'uncompleted',
    order: 1
  })
  .set('#id28', {
    active: false,
    status: 'disabled',
    order: 2
  })
  .set('#id4', {
    active: true,
    status: 'completed',
    order: 3
  })
  .set('#id5', {
    active: false,
    status: 'uncompleted',
    order: 4
  })
export const expectedStateAfterStepperSubmitted: StepperState = {
  steps: stepsAfterStepperSubmitted,
  initialSteps: stepsAfterFirstInitialization
}

// After "StepperReset" action dispatched

export const expectedStateAfterStepperReset: StepperState = {
  steps: stepsAfterFirstInitialization,
  initialSteps: stepsAfterFirstInitialization
}
