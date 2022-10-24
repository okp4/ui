import { Map } from 'immutable'
import { uniq } from 'lodash'
import type { Dispatch, Reducer } from 'react'
import { useState, useReducer } from 'react'
import type { DeepReadonly, UseReducer, UseState } from 'superTypes'

type StepStatus = 'disabled' | 'invalid' | 'completed' | 'uncompleted'
type ActiveStep = [activeId: string, activeStep: Step]

export type Step = {
  active: boolean
  order: number
  status: StepStatus
}

export type StepperState = {
  /**
   * The status of each step.
   */
  steps: Map<string, Step>
  /**
   * A state snapshot after first initialization.
   */
  initialSteps: Map<string, Step>
}

export type StepperAction =
  | { type: 'previousClicked' }
  | { type: 'stepCompleted' }
  | { type: 'stepFailed' }
  | { type: 'stepAddedBefore'; payload: { step: StepWithBeforeOrder } }
  | { type: 'stepAddedAfter'; payload: { step: StepWithAfterOrder } }
  | { type: 'stepperSubmitted' }
  | { type: 'stepperReset' }

export type InitialStep = {
  id: string
  status: StepStatus
}

export type StepWithBeforeOrder = InitialStep & {
  beforeOrder: number
}
export type StepWithAfterOrder = InitialStep & {
  afterOrder: number
}

export type InitializerArgs = {
  initialSteps: InitialStep[]
  initialActiveStepId?: string
}

const initialState: StepperState = { steps: Map(), initialSteps: Map() }

const getFilteredStepOrders = (steps: DeepReadonly<Map<string, Step>>): number[] =>
  steps
    .filter((step: DeepReadonly<Step>) => step.status !== 'disabled')
    .filter((step: DeepReadonly<Step>) => !step.active)
    .toIndexedSeq()
    .toArray()
    .map((step: DeepReadonly<Step>) => step.order)

const argsAreValid = (args: DeepReadonly<InitializerArgs>): boolean => {
  const { initialActiveStepId, initialSteps }: DeepReadonly<InitializerArgs> = args
  const stepKeys = initialSteps.map((step: DeepReadonly<InitialStep>) => step.id)
  const initialStepsAreValid =
    stepKeys.every((key: string) => key.length > 0) && uniq(stepKeys).length === stepKeys.length
  const initialActiveStepIdIsValid =
    initialActiveStepId !== undefined &&
    initialActiveStepId.length > 0 &&
    stepKeys.includes(initialActiveStepId)
  return initialStepsAreValid && initialActiveStepIdIsValid
}

const initState = (initializerArgs: DeepReadonly<InitializerArgs>): StepperState => {
  const { initialActiveStepId, initialSteps }: DeepReadonly<InitializerArgs> = initializerArgs
  const initialState = Map<string, Step>(
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
        (step: DeepReadonly<Step>) => step.active
      ) as ActiveStep
      const previousStep = getFilteredStepOrders(state.steps)
        .filter((nb: number) => nb < activeStep.order)
        .reduce((prev: number, cur: number) => Math.max(cur, prev), Infinity)
      const found = state.steps.findEntry((step: DeepReadonly<Step>) => step.order === previousStep)
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
        (step: DeepReadonly<Step>) => step.active
      ) as ActiveStep
      const nextStep = getFilteredStepOrders(state.steps)
        .filter((nb: number) => nb > activeStep.order)
        .reduce((prev: number, cur: number) => Math.min(cur, prev), Infinity)
      const found = state.steps.findEntry((step: DeepReadonly<Step>) => step.order === nextStep)
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
        (step: DeepReadonly<Step>) => step.active
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
            .map((step: DeepReadonly<Step>) => ({
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
            .map((step: DeepReadonly<Step>) => ({
              ...step,
              order: step.order > afterOrder ? step.order + 1 : step.order
            }))
            .set(id, { order: insertionOrder, active: false, status })
        })
      }
    }

    case 'stepperSubmitted': {
      const [activeId, activeStep]: ActiveStep = state.steps.findEntry(
        (step: DeepReadonly<Step>) => step.active
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
 * @param steps The initial {@link Step steps} of the Stepper.
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
      if (!argsAreValid(args)) {
        setError(new Error('Intial state is invalid, check the parameters provided to the hook'))
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
