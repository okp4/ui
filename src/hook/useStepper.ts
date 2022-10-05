import { List as ImmutableList, OrderedMap } from 'immutable'
import type { Dispatch, Reducer } from 'react'
import { useReducer } from 'react'
import type { DeepReadonly, UseReducer } from 'superTypes'

type StepStatus = 'disabled' | 'invalid' | 'completed' | 'uncompleted'

export type StepperState = {
  /**
   * The id of the step in progress.
   */
  currentStepId: string | undefined
  /**
   * The status of each step.
   */
  stepsStatus: OrderedMap<string, StepStatus>
  /**
   * The list of non-disabled steps.
   */
  enabledSteps: ImmutableList<string>
}

export type StepperAction =
  | { type: 'previousClicked' }
  | { type: 'stepCompleted' }
  | { type: 'stepFailed' }
  | { type: 'stepRemoved'; payload: string }
  | { type: 'stepAdded'; payload: { step: InitialStepStatus; index: number } }
  | { type: 'stepperSubmitted' }
  | { type: 'stepperReset'; payload: InitializerArgs }

export type InitialStepStatus = {
  id: string
  status?: StepStatus
}

export type InitializerArgs = {
  initialCurrentStepId: string
  initialStepsStatus: InitialStepStatus[]
}

const initState = (initializerArgs: DeepReadonly<InitializerArgs>): StepperState => {
  const enabledSteps = ImmutableList(
    initializerArgs.initialStepsStatus
      .filter(
        (initialStepStatus: DeepReadonly<InitialStepStatus>) =>
          initialStepStatus.status !== 'disabled'
      )
      .map(
        (filteredInitialStepStatus: DeepReadonly<InitialStepStatus>) => filteredInitialStepStatus.id
      )
  )

  return {
    currentStepId: initializerArgs.initialCurrentStepId,
    stepsStatus: OrderedMap<string, StepStatus>(
      initializerArgs.initialStepsStatus.map((step: DeepReadonly<InitialStepStatus>) => [
        step.id,
        step.status ?? 'uncompleted'
      ])
    ),
    enabledSteps
  }
}

// eslint-disable-next-line max-lines-per-function
const stepperReducer = (
  state: DeepReadonly<StepperState>,
  action: DeepReadonly<StepperAction>
): DeepReadonly<StepperState> => {
  if (state.currentStepId) {
    switch (action.type) {
      case 'previousClicked': {
        const previousStep = state.enabledSteps.get(
          state.enabledSteps.indexOf(state.currentStepId) - 1
        )
        return {
          ...state,
          currentStepId: previousStep,
          stepsStatus: state.stepsStatus.set(
            state.currentStepId,
            state.stepsStatus.get(state.currentStepId) !== 'invalid' ? 'uncompleted' : 'invalid'
          )
        }
      }
      case 'stepCompleted': {
        const nextStep = state.enabledSteps.get(state.enabledSteps.indexOf(state.currentStepId) + 1)
        return {
          ...state,
          currentStepId: nextStep,
          stepsStatus: state.stepsStatus.set(state.currentStepId, 'completed')
        }
      }
      case 'stepFailed':
        return {
          ...state,
          stepsStatus: state.stepsStatus.set(state.currentStepId, 'invalid')
        }
      case 'stepRemoved':
        return action.payload !== state.currentStepId
          ? {
              ...state,
              stepsStatus: state.stepsStatus.delete(action.payload),
              enabledSteps: state.enabledSteps.delete(
                state.enabledSteps.findIndex((id: string) => id === action.payload)
              )
            }
          : state
      case 'stepAdded': {
        const stepsStatus = state.stepsStatus.toArray()
        stepsStatus.splice(action.payload.index, 0, [
          action.payload.step.id,
          action.payload.step.status ?? 'uncompleted'
        ])
        return initState({
          initialCurrentStepId: state.currentStepId,
          initialStepsStatus: stepsStatus.map(
            ([id, status]: DeepReadonly<[string, StepStatus]>) => ({ id, status })
          )
        })
      }
      case 'stepperSubmitted': {
        return {
          ...state,
          stepsStatus: state.stepsStatus.set(state.currentStepId, 'completed')
        }
      }
      case 'stepperReset':
        return initState(action.payload)
      default:
        return state
    }
  }
  return state
}

export type UseStepper = {
  /**
   * The state of the Stepper.
   */
  state: StepperState
  /**
   * Function that allows to dispatch an action and updates the state.
   */
  dispatch: Dispatch<StepperAction>
}

/**
 * Facilitates management of the status and related actions of the Stepper.
 * @param currentStepId The initial id of the current step.
 * @param stepsStatus The initial steps {@link StepStatus status} of the Stepper.
 * @returns The state of the Stepper and the dispatch function to update the state.
 */
export const useStepper = (
  currentStepId: string,
  stepsStatus: DeepReadonly<InitialStepStatus[]>
): UseStepper => {
  const [state, dispatch]: UseReducer<StepperState, StepperAction> = useReducer<
    Reducer<StepperState, StepperAction>,
    DeepReadonly<InitializerArgs>
  >(
    stepperReducer,
    { initialCurrentStepId: currentStepId, initialStepsStatus: stepsStatus },
    initState
  )

  return {
    state,
    dispatch
  }
}
