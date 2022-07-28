import React, { useCallback, useReducer } from 'react'
import type { DeepReadonly, UseReducer, UseReducerAction } from 'superTypes'
import './stepper.scss'
import { Button } from '../../atoms/button/Button'
import classNames from 'classnames'
import './i18n/index'
import { useTranslation } from 'hook/useTranslation'
import type { UseTranslationResponse } from 'hook/useTranslation'
import { Typography } from 'ui/atoms/typography/Typography'
import { List } from 'immutable'
import type { Breakpoints } from 'hook/useBreakpoint'
import { useBreakpoint } from 'hook/useBreakpoint'

type StepperState = {
  enabledSteps: List<StepIndex>
  stepsStatuses: List<StepStatus>
  activeStepIndex: number
}

type Action = 'return' | 'complete' | 'fail' | 'submit' | 'reset'

export type StepStatus = 'disabled' | 'error' | 'completed' | 'active' | 'uncompleted'

export type StepIndex = number

export type Step = {
  /**
   * The title of the step
   */
  readonly label: string
  /**
   * The initial status of the step
   */
  readonly status?: StepStatus
  /**
   * The content of the step
   */
  readonly content?: JSX.Element
  /**
   * Callback method called when clicking on the next button
   * to validate the step and go to the next one
   */
  readonly onValidate?: () => boolean
}

export type StepperProps = {
  /**
   * The list of the steps
   */
  readonly steps: Step[]
  /**
   * The label of the submit button
   */
  readonly submitButtonLabel?: string
  /**
   * The label of the reset button
   */
  readonly resetButtonLabel?: string
  /**
   * The content displayed after submission
   */
  readonly successContent?: JSX.Element
  /**
   * Callback method called on click on next button
   */
  readonly onNext?: () => void
  /**
   * Callback method called when clicking on the submit button in the last step
   */
  readonly onSubmit?: () => void
  /**
   * Callback method called when clicking on the reset button after the last step
   */
  readonly onReset?: () => void
}

/**
 * Returns the inital state of the stepper.
 *
 * @param steps the steps of the stepper.
 * @returns the initial state of the stepper.
 */
const initState = (steps: DeepReadonly<Step[]>): StepperState => {
  const firstActiveIndex = steps.findIndex((step: DeepReadonly<Step>) => step.status === 'active')
  const initialActiveStep = firstActiveIndex > -1 ? firstActiveIndex : 0
  return {
    enabledSteps: List(
      steps.reduce((acc: DeepReadonly<StepIndex[]>, curr: DeepReadonly<Step>, index: number) => {
        return curr.status !== 'disabled' ? [...acc, index] : acc
      }, [])
    ),
    stepsStatuses: List(
      steps.map((step: DeepReadonly<Step>, index: number) =>
        index === initialActiveStep ? 'active' : step.status ?? 'uncompleted'
      )
    ),
    activeStepIndex: initialActiveStep
  }
}

/**
 * @param state the state of the stepper.
 * @param action the dispatch action of the reducer.
 * @returns the new state of the stepper.
 */
const stepperReducer = (
  state: DeepReadonly<StepperState>,
  action: DeepReadonly<UseReducerAction<Action, Step[]>>
): DeepReadonly<StepperState> => {
  switch (action.type) {
    case 'return': {
      const previousStepIndex =
        state.enabledSteps.get(state.enabledSteps.indexOf(state.activeStepIndex) - 1) ?? 0
      return {
        ...state,
        stepsStatuses: state.stepsStatuses
          .set(state.activeStepIndex, 'uncompleted')
          .set(previousStepIndex, 'active'),
        activeStepIndex: previousStepIndex
      }
    }
    case 'complete': {
      const nextStepIndex =
        state.enabledSteps.get(state.enabledSteps.indexOf(state.activeStepIndex) + 1) ?? 0
      return {
        ...state,
        stepsStatuses: state.stepsStatuses
          .set(state.activeStepIndex, 'completed')
          .set(nextStepIndex, 'active'),
        activeStepIndex: nextStepIndex
      }
    }
    case 'fail':
      return {
        ...state,
        stepsStatuses: state.stepsStatuses.set(state.activeStepIndex, 'error')
      }
    case 'submit':
      return {
        ...state,
        stepsStatuses: state.stepsStatuses.set(state.activeStepIndex, 'completed'),
        activeStepIndex: state.activeStepIndex + 1
      }
    case 'reset':
      if (action.payload) {
        return initState(action.payload)
      }
      return state
    default:
      return state
  }
}

/**
 * User Interface component to manage multiple steps
 */
// eslint-disable-next-line max-lines-per-function
export const Stepper: React.FC<StepperProps> = ({
  steps = [],
  submitButtonLabel,
  resetButtonLabel,
  successContent,
  onNext,
  onSubmit,
  onReset
}: DeepReadonly<StepperProps>): JSX.Element => {
  const { t }: UseTranslationResponse = useTranslation()
  const { isMedium, isLarge, isXLarge }: Breakpoints = useBreakpoint()

  const [state, dispatch]: UseReducer<StepperState, Action, Step[]> = useReducer(
    stepperReducer,
    steps,
    initState
  )

  const handlePreviousClick = useCallback((): void => {
    dispatch({ type: 'return' })
  }, [])

  const handleNextClick = useCallback((): void => {
    const clickOnNextSucceed =
      !steps[state.activeStepIndex].onValidate || steps[state.activeStepIndex].onValidate?.()
    if (clickOnNextSucceed) {
      onNext?.()
      dispatch({ type: 'complete' })
    } else {
      dispatch({ type: 'fail' })
    }
  }, [onNext, state.activeStepIndex, steps])

  const handleSubmit = useCallback((): void => {
    const isStepValid =
      !steps[state.activeStepIndex].onValidate || steps[state.activeStepIndex].onValidate?.()
    if (isStepValid) {
      onSubmit?.()
      dispatch({ type: 'submit' })
    } else {
      dispatch({ type: 'fail' })
    }
  }, [onSubmit, state.activeStepIndex, steps])

  const handleReset = useCallback((): void => {
    onReset?.()
    dispatch({ type: 'reset', payload: steps })
  }, [onReset, steps])

  return (
    <div className="okp4-stepper-main">
      <div className="okp4-stepper-steps">
        {isMedium || isLarge || isXLarge
          ? steps.map((step: DeepReadonly<Step>, index: number) => (
              <div className="okp4-step-header" key={index}>
                <div className={classNames('okp4-step-label', state.stepsStatuses.get(index))}>
                  <Typography
                    as="div"
                    fontSize="x-small"
                    fontWeight={state.stepsStatuses.get(index) === 'active' ? 'bold' : 'light'}
                  >
                    {step.label}
                  </Typography>
                </div>
                <div
                  className={classNames('okp4-step-state', state.stepsStatuses.get(index))}
                ></div>
              </div>
            ))
          : state.activeStepIndex < steps.length && (
              <div className="okp4-step-header">
                <div
                  className={classNames(
                    'okp4-step-label',
                    state.stepsStatuses.get(state.activeStepIndex)
                  )}
                >
                  <Typography as="div" fontSize="small" fontWeight="bold">
                    {steps[state.activeStepIndex]?.label}
                    {` (${state.activeStepIndex + 1}/${steps.length})`}
                  </Typography>
                </div>
                <div className="okp4-step-states-mobile">
                  {steps.map((_step: DeepReadonly<Step>, index: number) => (
                    <div
                      className={classNames('okp4-step-state', state.stepsStatuses.get(index))}
                      key={index}
                    ></div>
                  ))}
                </div>
              </div>
            )}
      </div>
      <div
        className={classNames('okp4-stepper-content', {
          error: state.stepsStatuses.get(state.activeStepIndex) === 'error'
        })}
      >
        {state.activeStepIndex === steps.length
          ? successContent
          : steps[state.activeStepIndex]?.content}
      </div>
      <div className="okp4-stepper-buttons">
        <div>
          {state.activeStepIndex > 0 && state.activeStepIndex < steps.length && (
            <Button
              label={t('stepper:step.button.previous')}
              onClick={handlePreviousClick}
              size="small"
              variant="secondary"
            />
          )}
        </div>
        <div>
          {state.activeStepIndex < steps.length - 1 && (
            <Button
              label={t('stepper:step.button.next')}
              onClick={handleNextClick}
              size="small"
              variant="secondary"
            />
          )}
          {state.activeStepIndex === steps.length - 1 && (
            <Button
              backgroundColor="success"
              label={submitButtonLabel ?? t('stepper:step.button.submit')}
              onClick={handleSubmit}
              size="small"
              variant="secondary"
            />
          )}
          {state.activeStepIndex === steps.length && (
            <Button
              backgroundColor="secondary"
              label={resetButtonLabel ?? t('stepper:step.button.reset')}
              onClick={handleReset}
              size="small"
              variant="secondary"
            />
          )}
        </div>
      </div>
    </div>
  )
}
