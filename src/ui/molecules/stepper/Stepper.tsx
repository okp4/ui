import type { Reducer } from 'react'
import React, { useCallback, useMemo, useReducer } from 'react'
import type { DeepReadonly, UseReducer } from 'superTypes'
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
import { Icon } from 'ui/atoms/icon/Icon'

export type StepStatus = 'disabled' | 'invalid' | 'completed' | 'active' | 'uncompleted'

export type StepIndex = number

type StepperState = {
  enabledSteps: List<StepIndex>
  stepsStatuses: List<StepStatus>
  activeStepIndex: StepIndex
}

type StepperAction =
  | { type: 'previousClicked' }
  | { type: 'stepCompleted' }
  | { type: 'stepFailed' }
  | { type: 'stepperSubmitted' }
  | { type: 'stepperReseted'; payload: List<Step> }

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
const initState = (steps: DeepReadonly<List<Step>>): StepperState => {
  const firstActiveIndex = steps.findIndex((step: DeepReadonly<Step>) => step.status === 'active')
  const initialActiveStep = firstActiveIndex > -1 ? firstActiveIndex : 0
  return {
    enabledSteps: steps.reduce(
      (acc: DeepReadonly<List<StepIndex>>, curr: DeepReadonly<Step>, index: number) => {
        return curr.status !== 'disabled' ? List([...acc, index]) : acc
      },
      List()
    ),
    stepsStatuses: steps.map((step: DeepReadonly<Step>, index: number) =>
      index === initialActiveStep ? 'active' : step.status ?? 'uncompleted'
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
  action: DeepReadonly<StepperAction>
): DeepReadonly<StepperState> => {
  switch (action.type) {
    case 'previousClicked': {
      const activeStepIndex = state.enabledSteps.indexOf(state.activeStepIndex)
      const previousStepIndex =
        activeStepIndex > 0
          ? state.enabledSteps.get(state.enabledSteps.indexOf(state.activeStepIndex) - 1) ?? 0
          : state.activeStepIndex
      return {
        ...state,
        stepsStatuses: state.stepsStatuses
          .set(state.activeStepIndex, 'uncompleted')
          .set(previousStepIndex, 'active'),
        activeStepIndex: previousStepIndex
      }
    }
    case 'stepCompleted': {
      const nextStepIndex =
        state.enabledSteps.get(state.enabledSteps.indexOf(state.activeStepIndex) + 1) ??
        state.activeStepIndex
      return {
        ...state,
        stepsStatuses: state.stepsStatuses
          .set(state.activeStepIndex, 'completed')
          .set(nextStepIndex, 'active'),
        activeStepIndex: nextStepIndex
      }
    }
    case 'stepFailed':
      return {
        ...state,
        stepsStatuses: state.stepsStatuses.set(state.activeStepIndex, 'invalid')
      }
    case 'stepperSubmitted':
      return {
        ...state,
        stepsStatuses: state.stepsStatuses.set(state.activeStepIndex, 'completed'),
        activeStepIndex: state.activeStepIndex + 1
      }
    case 'stepperReseted':
      return initState(action.payload)
    default:
      return state
  }
}

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
  const { isXSmall, isSmall }: Breakpoints = useBreakpoint()
  const isMobile = (): boolean => isXSmall || isSmall

  const [state, dispatch]: UseReducer<StepperState, StepperAction> = useReducer<
    Reducer<StepperState, StepperAction>,
    DeepReadonly<List<Step>>
  >(stepperReducer, List(steps), initState)

  const handlePreviousClick = useCallback((): void => {
    dispatch({ type: 'previousClicked' })
  }, [])

  const handleNextClick = useCallback((): void => {
    const clickOnNextSucceed =
      !steps[state.activeStepIndex].onValidate || steps[state.activeStepIndex].onValidate?.()
    if (clickOnNextSucceed) {
      onNext?.()
      dispatch({ type: 'stepCompleted' })
    } else {
      dispatch({ type: 'stepFailed' })
    }
  }, [onNext, state.activeStepIndex, steps])

  const handleSubmit = useCallback((): void => {
    const isStepValid =
      !steps[state.activeStepIndex].onValidate || steps[state.activeStepIndex].onValidate?.()
    if (isStepValid) {
      onSubmit?.()
      dispatch({ type: 'stepperSubmitted' })
    } else {
      dispatch({ type: 'stepFailed' })
    }
  }, [onSubmit, state.activeStepIndex, steps])

  const handleReset = useCallback((): void => {
    onReset?.()
    dispatch({ type: 'stepperReseted', payload: List(steps) })
  }, [onReset, steps])

  const isPreviousDisabled = useMemo(
    () => state.activeStepIndex === state.enabledSteps.get(0),
    [state.activeStepIndex, state.enabledSteps]
  )

  const isNextDisabled = useMemo(
    () => state.activeStepIndex === state.enabledSteps.get(-1),
    [state.activeStepIndex, state.enabledSteps]
  )

  return (
    <div className="okp4-stepper-main">
      <div className="okp4-stepper-header">
        {isMobile() ? (
          <div className="okp4-stepper-progress">
            <div
              className={classNames(
                'okp4-stepper-step-label',
                state.stepsStatuses.get(state.activeStepIndex)
              )}
            >
              <Typography as="div" fontSize="small" fontWeight="bold">
                {state.activeStepIndex < steps.length
                  ? `${steps[state.activeStepIndex].label} (${state.activeStepIndex + 1}/${
                      steps.length
                    })`
                  : `${steps[state.activeStepIndex - 1].label} (${state.activeStepIndex}/${
                      steps.length
                    })`}
              </Typography>
            </div>
            <div className="okp4-stepper-step-states-mobile">
              {steps.map((_step: DeepReadonly<Step>, index: number) => (
                <div
                  className={classNames('okp4-stepper-step-state', state.stepsStatuses.get(index))}
                  key={index}
                ></div>
              ))}
            </div>
          </div>
        ) : (
          steps.map((step: DeepReadonly<Step>, index: number) => (
            <div className="okp4-stepper-progress" key={index}>
              <div
                className={classNames('okp4-stepper-step-label', state.stepsStatuses.get(index))}
              >
                <Typography
                  as="div"
                  fontSize="x-small"
                  fontWeight={state.stepsStatuses.get(index) === 'active' ? 'bold' : 'light'}
                >
                  {step.label}
                </Typography>
              </div>
              <div
                className={classNames('okp4-stepper-step-state', state.stepsStatuses.get(index))}
              ></div>
            </div>
          ))
        )}
      </div>
      <div className="okp4-stepper-body">
        <div
          className={classNames('okp4-stepper-step-content', {
            error: state.stepsStatuses.get(state.activeStepIndex) === 'invalid'
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
                disabled={isPreviousDisabled}
                icon={<Icon name="arrow-left" size={20} />}
                label={t('stepper:step.button.previous')}
                onClick={handlePreviousClick}
                size="small"
                variant="icon"
              />
            )}
          </div>
          <div>
            {state.activeStepIndex < steps.length - 1 && (
              <Button
                disabled={isNextDisabled}
                icon={<Icon name="arrow-right" size={20} />}
                label={t('stepper:step.button.next')}
                onClick={handleNextClick}
                size="small"
                variant="icon"
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
    </div>
  )
}
