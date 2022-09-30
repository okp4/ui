import type { StepperState } from 'hook/useStepper'
import type { DeepReadonly } from 'superTypes'
import type { Step, StepId, StepStatus } from 'ui/index'

/**
 * Retrieve the status of the step by its id.
 * @param stepId The id of the step.
 * @param state The state of the Stepper
 * @returns The step status.
 */
export const getStepStatusByStepId = (
  stepId: StepId,
  state: DeepReadonly<StepperState>
): StepStatus => state.stepsStatus.get(stepId) ?? 'uncompleted'

/**
 * Get the updated steps with the new status from the Stepper state.
 * @param steps The step array.
 * @param state The state of the Stepper.
 * @returns A step array with updated status.
 */
export const getUpdatedSteps = (
  steps: DeepReadonly<Step[]>,
  state: DeepReadonly<StepperState>
): DeepReadonly<Step[]> =>
  steps.map((step: DeepReadonly<Step>) => ({
    ...step,
    status: state.stepsStatus.get(step.id)
  }))

/**
 * Retrieve the the current step.
 * @param steps The steps array.
 * @param state The state of the Stepper.
 * @returns The current step.
 */
export const getCurrentStep = (
  steps: DeepReadonly<Step[]>,
  state: DeepReadonly<StepperState>
): Step | undefined => steps.find((step: DeepReadonly<Step>) => step.id === state.currentStepId)
