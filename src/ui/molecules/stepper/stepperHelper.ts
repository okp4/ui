import type { StepperState } from 'hook/useStepper'
import { List as ImmutableList, OrderedMap } from 'immutable'
import type { DeepReadonly } from 'superTypes'
import type { Step, StepId, StepIndex, StepStatus } from 'ui/index'

/**
 * Initialize the status of the steps
 * @param steps The step array.
 * @returns The map of the status of the step.
 */
export const initStatus = (steps: DeepReadonly<Step[]>): OrderedMap<StepId, StepStatus> =>
  OrderedMap<StepId, StepStatus>(
    steps.map((step: DeepReadonly<Step>) => [step.id, step.status ?? 'uncompleted'])
  )

/**
 * Update the status of the step thank to the Stepper React state.
 * @param steps The step array.
 * @param state The React state of the Stepper.
 * @returns a step array with updated status.
 */
export const updateStepStatus = (
  steps: DeepReadonly<Step[]>,
  state: DeepReadonly<StepperState>
): DeepReadonly<Step[]> =>
  ImmutableList(steps)
    .map((step: DeepReadonly<Step>) => {
      return {
        ...step,
        status: state.stepStatus.get(step.id)
      }
    })
    .toArray()

/**
 * Retrieve the index of the step.
 * @param steps The step array.
 * @param id The ID of the step.
 * @returns The index of the step.
 */
export const getStepIndex = (steps: DeepReadonly<Step[]>, id: StepId): StepIndex =>
  steps.findIndex((step: DeepReadonly<Step>) => step.id === id)

/**
 * Retrieve the index of the current step.
 * @param steps The step array.
 * @param state The React state of the Stepper.
 * @returns The index of the current step.
 */
export const getCurrent = (
  steps: DeepReadonly<Step[]>,
  state: DeepReadonly<StepperState>
): StepIndex => getStepIndex(steps, state.currentStep)
