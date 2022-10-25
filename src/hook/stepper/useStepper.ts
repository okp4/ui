import { Map } from 'immutable'
import { uniq } from 'lodash'
import type { Dispatch, Reducer } from 'react'
import { useState, useReducer } from 'react'
import type { DeepReadonly, UseReducer, UseState } from 'superTypes'

type StepStatus = 'disabled' | 'invalid' | 'completed' | 'uncompleted'
type ActiveStep = [activeId: string, activeStep: StepData]

export type StepData = {
  /**
   * Defines if the step is active.
   */
  active: boolean
  /**
   * Defines the order of the step in the list.
   */
  order: number
  /**
   * The status of the step.
   */
  status: StepStatus
}

export type InitialStep = {
  /**
   * The id of the step.
   */
  id: string
  /**
   * The status of the step.
   */
  status: StepStatus
}

export type StepWithBeforeOrder = InitialStep & {
  /**
   * The order of the step before.
   */
  beforeOrder: number
}
export type StepWithAfterOrder = InitialStep & {
  /**
   * The order of the step after.
   */
  afterOrder: number
}

export type StepperState = {
  /**
   * The status and order of each step.
   */
  steps: Map<string, StepData>
  /**
   * A state snapshot after first initialization.
   */
  initialSteps: Map<string, StepData>
}

export type StepperAction =
  | { type: 'previousClicked' }
  | { type: 'stepCompleted' }
  | { type: 'stepFailed' }
  | { type: 'stepAddedBefore'; payload: { step: StepWithBeforeOrder } }
  | { type: 'stepAddedAfter'; payload: { step: StepWithAfterOrder } }
  | { type: 'stepperSubmitted' }
  | { type: 'stepperReset' }

export type InitializerArgs = {
  /**
   * The list of the initial steps.
   */
  initialSteps: InitialStep[]
  /**
   * The id of initial active step.
   */
  initialActiveStepId?: string
}

const initialState: StepperState = { steps: Map(), initialSteps: Map() }

const getFilteredStepOrders = (steps: DeepReadonly<Map<string, StepData>>): number[] =>
  steps
    .filter((step: DeepReadonly<StepData>) => step.status !== 'disabled')
    .filter((step: DeepReadonly<StepData>) => !step.active)
    .toIndexedSeq()
    .toArray()
    .map((step: DeepReadonly<StepData>) => step.order)

const isEachArgValid = (args: DeepReadonly<InitializerArgs>): boolean => {
  const { initialActiveStepId, initialSteps }: DeepReadonly<InitializerArgs> = args
  const stepKeys = initialSteps.map((step: DeepReadonly<InitialStep>) => step.id)
  const isEachInitialStepValid =
    initialSteps.length > 0 &&
    stepKeys.every((key: string) => key.length > 0) &&
    uniq(stepKeys).length === stepKeys.length
  const isInitialActiveStepIdValid =
    initialActiveStepId === undefined ||
    (initialActiveStepId.length > 0 && stepKeys.includes(initialActiveStepId))
  return isEachInitialStepValid && isInitialActiveStepIdValid
}

const initState = (initializerArgs: DeepReadonly<InitializerArgs>): StepperState => {
  const { initialActiveStepId, initialSteps }: DeepReadonly<InitializerArgs> = initializerArgs
  const initialState = Map<string, StepData>(
    initialSteps.map((step: DeepReadonly<InitialStep>, index: number) => {
      const active =
        (initialActiveStepId === undefined && step.status !== 'disabled' && index === 0) ||
        (initialActiveStepId !== undefined && step.id === initialActiveStepId)
      return [
        step.id,
        {
          active,
          order: index,
          status: step.status
        }
      ]
    })
  )
  return {
    steps: initialState,
    initialSteps: initialState
  }
}

// eslint-disable-next-line max-lines-per-function
const stepperReducer = (
  state: DeepReadonly<StepperState>,
  action: DeepReadonly<StepperAction>
): DeepReadonly<StepperState> => {
  switch (action.type) {
    case 'previousClicked': {
      const [activeId, activeStep]: ActiveStep = state.steps.findEntry(
        (step: DeepReadonly<StepData>) => step.active
      ) as ActiveStep
      const previousStep = getFilteredStepOrders(state.steps)
        .filter((nb: number) => nb < activeStep.order)
        .reduce((prev: number, cur: number) => Math.max(cur, prev), -Infinity)
      const found = state.steps.findEntry(
        (step: DeepReadonly<StepData>) => step.order === previousStep
      )
      return {
        ...state,
        ...(found && {
          steps: state.steps
            .set(activeId, {
              ...activeStep,
              active: false,
              status: state.steps.get(activeId)?.status !== 'invalid' ? 'uncompleted' : 'invalid'
            })
            .set(found[0], { ...found[1], active: true })
        })
      }
    }
    case 'stepCompleted': {
      const [activeId, activeStep]: ActiveStep = state.steps.findEntry(
        (step: DeepReadonly<StepData>) => step.active
      ) as ActiveStep
      const nextStep = getFilteredStepOrders(state.steps)
        .filter((nb: number) => nb > activeStep.order)
        .reduce((prev: number, cur: number) => Math.min(cur, prev), Infinity)
      const found = state.steps.findEntry((step: DeepReadonly<StepData>) => step.order === nextStep)
      return {
        ...state,
        ...(found && {
          steps: state.steps
            .set(activeId, {
              ...activeStep,
              active: false,
              status: 'completed'
            })
            .set(found[0], { ...found[1], active: true })
        })
      }
    }
    case 'stepFailed': {
      const [activeId, activeStep]: ActiveStep = state.steps.findEntry(
        (step: DeepReadonly<StepData>) => step.active
      ) as ActiveStep

      return {
        ...state,
        steps: state.steps.set(activeId, { ...activeStep, status: 'invalid' })
      }
    }
    case 'stepAddedBefore': {
      const { id, status, beforeOrder }: StepWithBeforeOrder = action.payload.step
      const payloadIsOk = id.length > 0 && !state.steps.keySeq().toArray().includes(id)
      const insertionOrder =
        beforeOrder > state.steps.size ? state.steps.size : beforeOrder < 0 ? 0 : beforeOrder
      return {
        ...state,
        ...(payloadIsOk && {
          steps: state.steps
            .map((step: DeepReadonly<StepData>) => ({
              ...step,
              order: step.order >= beforeOrder ? step.order + 1 : step.order
            }))
            .set(id, { order: insertionOrder, active: false, status })
        })
      }
    }
    case 'stepAddedAfter': {
      const { id, status, afterOrder }: StepWithAfterOrder = action.payload.step
      const payloadIsOk = id.length > 0 && !state.steps.keySeq().toArray().includes(id)
      const insertionOrder =
        afterOrder > state.steps.size ? state.steps.size : afterOrder < 0 ? 0 : afterOrder + 1

      return {
        ...state,
        ...(payloadIsOk && {
          steps: state.steps
            .map((step: DeepReadonly<StepData>) => ({
              ...step,
              order: step.order > afterOrder ? step.order + 1 : step.order
            }))
            .set(id, { order: insertionOrder, active: false, status })
        })
      }
    }
    case 'stepperSubmitted': {
      const [activeId, activeStep]: ActiveStep = state.steps.findEntry(
        (step: DeepReadonly<StepData>) => step.active
      ) as ActiveStep

      return {
        ...state,
        steps: state.steps.set(activeId, { ...activeStep, status: 'completed' })
      }
    }
    case 'stepperReset':
      return {
        ...state,
        steps: state.initialSteps
      }
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
   * Function that allows to dispatch an action and updates the state.
   */
  dispatch: Dispatch<StepperAction>
  /**
   * If the hook parameters are invalid, an error is provided and the state
   * will be empty.
   */
  error: Error | null
}

/**
 * Facilitates management of the related actions of the Stepper.
 * @param steps The initial {@link StepData steps} of the Stepper.
 * @param activeStepId The initial id of the active step.
 * @returns The state of the Stepper and the dispatch function to update the state.
 */
export const useStepper = (
  steps: DeepReadonly<InitialStep[]>,
  activeStepId?: string
): UseStepper => {
  const [error, setError]: UseState<null | Error> = useState<null | Error>(null)
  const [state, dispatch]: UseReducer<StepperState, StepperAction> = useReducer<
    Reducer<StepperState, StepperAction>,
    DeepReadonly<InitializerArgs>
  >(
    stepperReducer,
    { initialActiveStepId: activeStepId, initialSteps: steps },
    (args: DeepReadonly<InitializerArgs>) => {
      if (!isEachArgValid(args)) {
        setError(new Error('Intial state is invalid, check the parameters provided to the hook.'))
        return initialState
      }
      return initState(args)
    }
  )

  return {
    state,
    error,
    dispatch: error ? (): void => undefined : dispatch
  }
}
