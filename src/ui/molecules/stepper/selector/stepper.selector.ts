import type { StepperState, Step as StateStep } from 'hook/stepper/useStepper'
import type { DeepReadonly } from 'superTypes'
import type { Step } from 'ui/index'

/**
 * Get the updated steps with the new status from the Stepper state.
 * @param steps The step array.
 * @param state The state of the Stepper.
 * @returns A steps array with updated status.
 */
export const getUpdatedSteps = (
  steps: DeepReadonly<Step[]>,
  state: DeepReadonly<StepperState>
): Step[] =>
  steps.map((step: DeepReadonly<Step>) => ({
    ...step,
    status: state.steps.get(step.id)?.status
  }))

export const getActiveStepId = (state: DeepReadonly<StepperState>): string | undefined =>
  state.steps.findKey((step: DeepReadonly<StateStep>) => step.active)
