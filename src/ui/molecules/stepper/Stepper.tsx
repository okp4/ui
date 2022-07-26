import React, { useCallback, useEffect, useReducer } from 'react'
import type { DeepReadonly, ReduceHook } from 'superTypes'
import './stepper.scss'
import { Button } from '../../atoms/button/Button'
import classNames from 'classnames'
import './i18n/index'
import { useTranslation } from 'hook/useTranslation'
import type { UseTranslationResponse } from 'hook/useTranslation'
import { Typography } from 'ui/atoms/typography/Typography'

export type InitialStatus = 'disabled' | 'error' | 'completed'
export type StepStatus = InitialStatus | 'active' | 'uncompleted'
export type StepIndex = number

export type Step = {
  /**
   * The title of the step
   */
  readonly label: string
  /**
   * The initial status of the step
   */
  readonly status?: InitialStatus
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
   * The index of the active step
   */
  readonly active?: StepIndex
  /**
   * The label of the next button
   */
  readonly submitButtonLabel?: string
  /**
   * Callback method called on click on next button
   */
  readonly onNext?: () => void
  /**
   * Callback method called when clicking on the submit button in the last step
   */
  readonly onSubmit?: () => void
}

/**
 * User Interface component to manage multiple steps
 */
// eslint-disable-next-line max-lines-per-function
export const Stepper: React.FC<StepperProps> = ({
  steps = [],
  active = 0,
  submitButtonLabel,
  onNext,
  onSubmit
}: DeepReadonly<StepperProps>): JSX.Element => {
  const { t }: UseTranslationResponse = useTranslation()

  type StepperStateHook = {
    enabledSteps: DeepReadonly<StepIndex[]>
    stepsStatus: DeepReadonly<StepStatus[]>
    activeStepIndex: number
  }

  const initialState: StepperStateHook = {
    enabledSteps: [],
    stepsStatus: [],
    activeStepIndex: active
  }

  const dispatchInit = (): StepperStateHook => {
    return {
      enabledSteps: [
        ...steps.reduce(
          (acc: DeepReadonly<StepIndex[]>, curr: DeepReadonly<Step>, index: number) => {
            return curr.status !== 'disabled' ? [...acc, index] : acc
          },
          []
        )
      ],
      stepsStatus: steps.map((step: DeepReadonly<Step>, index: number) =>
        index === active ? 'active' : step.status ?? 'uncompleted'
      ),
      activeStepIndex: active
    }
  }

  const dispatchPrevious = (
    state: DeepReadonly<StepperStateHook>
  ): DeepReadonly<StepperStateHook> => {
    const updatedStates = [...state.stepsStatus]
    const previousStepIndex =
      state.enabledSteps[state.enabledSteps.indexOf(state.activeStepIndex) - 1]
    if (previousStepIndex > -1) {
      updatedStates[state.activeStepIndex] = 'uncompleted'
      updatedStates[previousStepIndex] = 'active'
      return {
        ...state,
        stepsStatus: updatedStates,
        activeStepIndex: previousStepIndex
      }
    }
    return state
  }

  const dispatchNext = (state: DeepReadonly<StepperStateHook>): DeepReadonly<StepperStateHook> => {
    const updatedStates = [...state.stepsStatus]
    const nextStepIndex = state.enabledSteps[state.enabledSteps.indexOf(state.activeStepIndex) + 1]
    const clickOnNextSucceed =
      !steps[state.activeStepIndex].onValidate || steps[state.activeStepIndex].onValidate?.()
    if (clickOnNextSucceed) {
      onNext?.()
      updatedStates[nextStepIndex] = 'active'
    }
    updatedStates[state.activeStepIndex] = clickOnNextSucceed ? 'completed' : 'error'
    return {
      ...state,
      stepsStatus: updatedStates,
      activeStepIndex:
        clickOnNextSucceed && nextStepIndex > -1 ? nextStepIndex : state.activeStepIndex
    }
  }

  const dispatchSubmit = (
    state: DeepReadonly<StepperStateHook>
  ): DeepReadonly<StepperStateHook> => {
    const updatedStates = [...state.stepsStatus]
    onSubmit?.()
    updatedStates[state.activeStepIndex] = 'completed'
    return {
      ...state,
      stepsStatus: updatedStates
    }
  }

  const reducer = (
    state: DeepReadonly<StepperStateHook>,
    action: DeepReadonly<{ type: string }>
  ): DeepReadonly<StepperStateHook> => {
    switch (action.type) {
      case 'init':
        return dispatchInit()
      case 'previous':
        return dispatchPrevious(state)
      case 'next':
        return dispatchNext(state)
      case 'submit':
        return dispatchSubmit(state)
      default:
        return initialState
    }
  }

  const [state, dispatch]: ReduceHook<StepperStateHook> = useReducer(reducer, initialState)

  useEffect(() => {
    dispatch({ type: 'init' })
  }, [])

  const handlePreviousClick = useCallback((): void => {
    dispatch({ type: 'previous' })
  }, [])

  const handleNextClick = useCallback((): void => {
    dispatch({ type: 'next' })
  }, [])

  const handleSubmit = useCallback((): void => {
    dispatch({ type: 'submit' })
  }, [])

  return (
    <div className="okp4-stepper-main">
      <div className="okp4-stepper-steps">
        {steps.map((step: DeepReadonly<Step>, index: number) => (
          <div className="okp4-step-header" key={index}>
            <div className={classNames('okp4-step-label', state.stepsStatus[index])}>
              <Typography
                as="div"
                fontSize="x-small"
                fontWeight={state.stepsStatus[index] === 'active' ? 'bold' : 'light'}
              >
                {step.label}
              </Typography>
            </div>
            <div className={classNames('okp4-step-state', state.stepsStatus[index])}></div>
          </div>
        ))}
      </div>
      <div
        className={classNames('okp4-stepper-content', {
          error: state.stepsStatus[state.activeStepIndex] === 'error'
        })}
      >
        {steps[state.activeStepIndex]?.content}
      </div>
      <div className="okp4-stepper-buttons">
        <div>
          {state.activeStepIndex > 0 && (
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
        </div>
      </div>
    </div>
  )
}
