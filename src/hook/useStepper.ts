import type { OrderedMap } from 'immutable'
import { List as ImmutableList } from 'immutable'
import type { Dispatch, Reducer } from 'react'
import { useReducer } from 'react'
import type { DeepReadonly, UseReducer } from 'superTypes'
import type { StepId, StepStatus } from 'ui/index'

export type StepperState = {
  /**
   * The ID of the step in progress.
   */
  currentStep: StepId
  /**
   * The status of the steps.
   */
  stepStatus: OrderedMap<StepId, StepStatus>
  /**
   * The list of the not disabled steps.
   */
  enabledSteps: ImmutableList<StepId>
  /**
   * Defines if there is a previous step not disabled.
   */
  isAnyPreviousStepEnabled: boolean
  /**
   * Defines if there is a next step not disabled.
   */
  isAnyNextStepEnabled: boolean
}

export type StepperAction =
  | { type: 'previousClicked' }
  | { type: 'stepCompleted' }
  | { type: 'stepFailed' }
  | { type: 'stepperSubmitted' }
  | { type: 'stepperReseted'; payload: InitializerArgs }

type InitializerArgs = DeepReadonly<{
  initialActiveStep: string
  initialStatus: OrderedMap<string, StepStatus>
}>

const initState = (initializerArgs: DeepReadonly<InitializerArgs>): StepperState => {
  const currentStep = initializerArgs.initialActiveStep
  const enabledSteps = ImmutableList(
    initializerArgs.initialStatus.filter((status: StepStatus) => status !== 'disabled').keys()
  )
  return {
    currentStep,
    stepStatus: initializerArgs.initialStatus,
    enabledSteps,
    isAnyPreviousStepEnabled: currentStep !== enabledSteps.first(),
    isAnyNextStepEnabled: currentStep !== enabledSteps.last()
  }
}

export const stepperReducer = (
  state: DeepReadonly<StepperState>,
  action: DeepReadonly<StepperAction>
): DeepReadonly<StepperState> => {
  switch (action.type) {
    case 'previousClicked': {
      const previousStep =
        state.enabledSteps.get(state.enabledSteps.indexOf(state.currentStep) + -1) ??
        state.currentStep
      return {
        ...state,
        currentStep: previousStep,
        stepStatus: state.stepStatus.set(
          state.currentStep,
          state.stepStatus.get(state.currentStep) !== 'invalid' ? 'uncompleted' : 'invalid'
        ),
        isAnyPreviousStepEnabled: previousStep !== state.enabledSteps.first(),
        isAnyNextStepEnabled: previousStep !== state.enabledSteps.last()
      }
    }
    case 'stepCompleted': {
      const nextStep =
        state.enabledSteps.get(state.enabledSteps.indexOf(state.currentStep) + 1) ??
        state.currentStep
      return {
        ...state,
        currentStep: nextStep,
        stepStatus: state.stepStatus.set(state.currentStep, 'completed'),
        isAnyPreviousStepEnabled: nextStep !== state.enabledSteps.first(),
        isAnyNextStepEnabled: nextStep !== state.enabledSteps.last()
      }
    }
    case 'stepFailed':
      return {
        ...state,
        stepStatus: state.stepStatus.set(state.currentStep, 'invalid')
      }
    case 'stepperSubmitted': {
      return {
        ...state,
        stepStatus: state.stepStatus.set(state.currentStep, 'completed')
      }
    }
    case 'stepperReseted':
      return initState(action.payload)
    default:
      return state
  }
}

export type UseStepper = {
  /**
   * The state of the Stepper.
   */
  state: StepperState
  /**
   * Callback method that allows to dispatch an action and updates the state.
   */
  dispatch: Dispatch<StepperAction>
}

/**
 * Facilitates management of the status and related actions of the Stepper.
 * @param currentStep The initial {@link StepId ID} of the current step.
 * @param status The initial {@link StepStatus status} of the steps of the Stepper.
 * @returns The state of the Stepper and the associated dispatch callback function.
 */
export const useStepper = (
  currentStep: string,
  status: Readonly<OrderedMap<string, StepStatus>>
): UseStepper => {
  const [state, dispatch]: UseReducer<StepperState, StepperAction> = useReducer<
    Reducer<StepperState, StepperAction>,
    InitializerArgs
  >(stepperReducer, { initialActiveStep: currentStep, initialStatus: status }, initState)

  return {
    state,
    dispatch
  }
}
