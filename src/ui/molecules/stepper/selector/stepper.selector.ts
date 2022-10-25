import type { StepperState, StepData as StateStep } from 'hook/stepper/useStepper'
import type { DeepReadonly } from 'superTypes'
import type { Step } from 'ui/index'

const getStepOrder = (stepId: string, state: DeepReadonly<StepperState>): number =>
  state.steps.get(stepId)?.order as number

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
  steps
    .map((step: DeepReadonly<Step>) => ({
      ...step,
      status: state.steps.get(step.id)?.status
    }))
    .sort(
      (step1: DeepReadonly<Step>, step2: DeepReadonly<Step>) =>
        getStepOrder(step1.id, state) - getStepOrder(step2.id, state)
    )

/**
 * Get the id of the active step.
 * @param state The state of the Stepper
 * @returns The id of the active step.
 */
export const getActiveStepId = (state: DeepReadonly<StepperState>): string | undefined =>
  state.steps.findKey((step: DeepReadonly<StateStep>) => step.active)
