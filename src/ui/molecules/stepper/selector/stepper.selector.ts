import type { StepperState } from 'hook/useStepper'
import { OrderedMap } from 'immutable'
import type { DeepReadonly } from 'superTypes'
import type { Step, StepId, StepIndex, StepStatus } from 'ui/index'

/**
 * Get the status of the steps.
 * @param steps The step array.
 * @returns The map of the status of the step.
 */
export const getStatusFromSteps = (steps: DeepReadonly<Step[]>): OrderedMap<StepId, StepStatus> =>
  OrderedMap<StepId, StepStatus>(
    steps.map((step: DeepReadonly<Step>) => [step.id, step.status ?? 'uncompleted'])
  )

/**
 * Retrieve the status of the step by its ID.
 * @param id The ID of the step.
 * @param state The React state of the Stepper
 * @returns The step status.
 */
export const getStepStatusByStepId = (
  id: StepId,
  state: DeepReadonly<StepperState>
): StepStatus | undefined => state.stepStatus.get(id)

/**
 * Update the status of the step thank to the Stepper React state.
 * @param steps The step array.
 * @param state The React state of the Stepper.
 * @returns a step array with updated status.
 */
export const getStepsWithUpdatedStatus = (
  steps: DeepReadonly<Step[]>,
  state: DeepReadonly<StepperState>
): DeepReadonly<Step[]> =>
  steps.map((step: DeepReadonly<Step>) => {
    return {
      ...step,
      status: state.stepStatus.get(step.id)
    }
  })

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
export const getCurrentStepIndex = (
  steps: DeepReadonly<Step[]>,
  state: DeepReadonly<StepperState>
): StepIndex => getStepIndex(steps, state.currentStep)

/**
 * Defines if there is any step not disabled before the current step.
 * @param state The React state of the Stepper.
 * @returns A boolean that defines if there is any step enabled before the current step.
 */
export const isAnyPreviousStepEnabled = (state: DeepReadonly<StepperState>): boolean =>
  state.currentStep !== state.enabledSteps.first()

/**
 * Defines if there is any step not disabled after the current step.
 * @param state The React state of the Stepper.
 * @returns A boolean that defines if there is any step enabled after the current step.
 */
export const isAnyNextStepEnabled = (state: DeepReadonly<StepperState>): boolean =>
  state.currentStep !== state.enabledSteps.last()
