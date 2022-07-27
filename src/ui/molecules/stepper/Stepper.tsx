import React, { useCallback, useMemo, useReducer } from 'react'
import type { DeepReadonly, Reducer } from 'superTypes'
import './stepper.scss'
import { Button } from '../../atoms/button/Button'
import classNames from 'classnames'
import './i18n/index'
import { useTranslation } from 'hook/useTranslation'
import type { UseTranslationResponse } from 'hook/useTranslation'
import { Typography } from 'ui/atoms/typography/Typography'
import { List } from 'immutable'

type StepperState = {
  enabledSteps: List<StepIndex>
  stepsStatuses: List<StepStatus>
  activeStepIndex: number
}

type Action = 'previous' | 'next' | 'submit' | 'reset'

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
 * User Interface component to manage multiple steps
 */
// eslint-disable-next-line max-lines-per-function
export const Stepper: React.FC<StepperProps> = ({
  steps = [],
  submitButtonLabel,
  resetButtonLabel,
  onNext,
  onSubmit,
  onReset,
}: DeepReadonly<StepperProps>): JSX.Element => {
  const { t }: UseTranslationResponse = useTranslation()

  const initState = useMemo(
    () =>
      (steps: DeepReadonly<Step[]>): StepperState => {
        const firstActiveIndex = steps.findIndex(
          (step: DeepReadonly<Step>) => step.status === 'active'
        )
        const initialActiveStep = firstActiveIndex > -1 ? firstActiveIndex : 0
        return {
          enabledSteps: List(
            steps.reduce(
              (acc: DeepReadonly<StepIndex[]>, curr: DeepReadonly<Step>, index: number) => {
                return curr.status !== 'disabled' ? [...acc, index] : acc
              },
              []
            )
          ),
          stepsStatuses: List(
            steps.map((step: DeepReadonly<Step>, index: number) =>
              index === initialActiveStep ? 'active' : step.status ?? 'uncompleted'
            )
          ),
          activeStepIndex: initialActiveStep
        }
      },
    []
  )

  const executePrevious = useMemo(
    () =>
      (state: DeepReadonly<StepperState>): DeepReadonly<StepperState> => {
        const previousStepIndex =
          state.enabledSteps.get(state.enabledSteps.indexOf(state.activeStepIndex) - 1) ?? 0
        return {
          ...state,
          stepsStatuses: state.stepsStatuses
            .set(state.activeStepIndex, 'uncompleted')
            .set(previousStepIndex, 'active'),
          activeStepIndex: previousStepIndex
        }
      },
    []
  )

  const executeNext = useMemo(
    () =>
      (state: DeepReadonly<StepperState>): DeepReadonly<StepperState> => {
        const nextStepIndex =
          state.enabledSteps.get(state.enabledSteps.indexOf(state.activeStepIndex) + 1) ?? 0
        const clickOnNextSucceed =
          !steps[state.activeStepIndex].onValidate || steps[state.activeStepIndex].onValidate?.()
        if (clickOnNextSucceed) {
          onNext?.()
        }
        return clickOnNextSucceed
          ? {
              ...state,
              stepsStatuses: state.stepsStatuses
                .set(state.activeStepIndex, 'completed')
                .set(nextStepIndex, 'active'),
              activeStepIndex: nextStepIndex
            }
          : {
              ...state,
              stepsStatuses: state.stepsStatuses.set(state.activeStepIndex, 'error')
            }
      },
    [onNext, steps]
  )

  const executeSubmit = useMemo(
    () =>
      (state: DeepReadonly<StepperState>): DeepReadonly<StepperState> => {
        const isStepValid =
          !steps[state.activeStepIndex].onValidate || steps[state.activeStepIndex].onValidate?.()
        if (isStepValid) {
          onSubmit?.()
          return {
            ...state,
            stepsStatuses: state.stepsStatuses.set(state.activeStepIndex, 'completed'),
            activeStepIndex: state.activeStepIndex + 1
          }
        }
        return {
          ...state,
          stepsStatuses: state.stepsStatuses.set(state.activeStepIndex, 'error')
        }
      },
    [onSubmit, steps]
  )

  const executeReset = useMemo(
    () =>
      (steps: DeepReadonly<Step[]>): DeepReadonly<StepperState> => {
        onReset?.()
        return initState(steps)
      },
    [initState, onReset]
  )

  const stepperReducer = useCallback(
    (
      state: DeepReadonly<StepperState>,
      action: DeepReadonly<{ type: Action }>
    ): DeepReadonly<StepperState> => {
      switch (action.type) {
        case 'previous':
          return executePrevious(state)
        case 'next':
          return executeNext(state)
        case 'submit':
          return executeSubmit(state)
        case 'reset':
          return executeReset(steps)
        default:
          return initState(steps)
      }
    },
    [initState, executePrevious, executeNext, executeSubmit, executeReset, steps]
  )

  const [state, dispatch]: Reducer<StepperState, Action> = useReducer(
    stepperReducer,
    steps,
    initState
  )

  const handlePreviousClick = useCallback((): void => {
    dispatch({ type: 'previous' })
  }, [])

  const handleNextClick = useCallback((): void => {
    dispatch({ type: 'next' })
  }, [])

  const handleSubmit = useCallback((): void => {
    dispatch({ type: 'submit' })
  }, [])

  const handleReset = useCallback((): void => {
    dispatch({ type: 'reset' })
  }, [])

  return (
    <div className="okp4-stepper-main">
      <div className="okp4-stepper-steps">
        {steps.map((step: DeepReadonly<Step>, index: number) => (
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
            <div className={classNames('okp4-step-state', state.stepsStatuses.get(index))}></div>
          </div>
        ))}
      </div>
      <div
        className={classNames('okp4-stepper-content', {
          error: state.stepsStatuses.get(state.activeStepIndex) === 'error'
        })}
      >
        {steps[state.activeStepIndex]?.content}
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
