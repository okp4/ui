import React, { useCallback, useState, useEffect } from 'react'
import type { DeepReadonly, StateHook } from 'superTypes'
import './stepper.scss'
import { Button } from '../../atoms/button/Button'
import classNames from 'classnames'
import './i18n/index'
import { t } from 'i18next'
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
   * Callback method called on click on the next button
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
  readonly activeStep?: StepIndex
  /**
   * The label of the next button
   */
  readonly submitButtonLabel?: string
  /**
   * Callback method called on click on next button
   */
  readonly onClickNext?: () => void
  /**
   * Callback method called when click on the submit button on the last step
   */
  readonly onSubmit?: () => void
}

/**
 * UI component for manage several steps
 */
// eslint-disable-next-line max-lines-per-function
export const Stepper: React.FC<StepperProps> = ({
  steps = [],
  activeStep = 0,
  submitButtonLabel,
  onClickNext,
  onSubmit
}: DeepReadonly<StepperProps>): JSX.Element => {
  const [enabledSteps, setEnabledSteps]: StateHook<StepIndex[]> = useState<StepIndex[]>([])
  const [stepsStatus, setStepsStatus]: StateHook<StepStatus[]> = useState<StepStatus[]>([])
  const [activeStepIndex, setActiveStepIndex]: StateHook<StepIndex> = useState(activeStep)

  /**
   * Returns the status og the step
   * @param step The step
   * @param active Defines if the step is active
   * @returns step status
   */
  const getStepStatus = (step: DeepReadonly<Step>, active: boolean): StepStatus =>
    active ? 'active' : step.status ?? 'uncompleted'

  useEffect(() => {
    setEnabledSteps([
      ...steps.reduce((acc: DeepReadonly<StepIndex[]>, curr: DeepReadonly<Step>, index: number) => {
        return curr.status !== 'disabled' ? [...acc, index] : acc
      }, [])
    ])
    setStepsStatus(
      steps.map((step: DeepReadonly<Step>, index: number) =>
        getStepStatus(step, index === activeStep)
      )
    )
  }, [steps, activeStep])

  /**
   * Get the step matching with the active step index
   */
  const getActiveStep = useCallback(
    (): DeepReadonly<Step> => steps[activeStepIndex],
    [activeStepIndex, steps]
  )

  /**
   * Performs when the previous button is clicked
   */
  const handleClickPrevious = useCallback((): void => {
    const previousStepIndex = enabledSteps[enabledSteps.indexOf(activeStepIndex) - 1]
    if (previousStepIndex > -1) {
      setActiveStepIndex(previousStepIndex)
      const updatedStates = [...stepsStatus]
      updatedStates[activeStepIndex] = 'uncompleted'
      updatedStates[previousStepIndex] = 'active'
      setStepsStatus(updatedStates)
    }
  }, [activeStepIndex, enabledSteps, stepsStatus])

  /**
   * Performs when the next button is clicked
   */
  const handleClickNext = useCallback((): void => {
    const nextStepIndex = enabledSteps[enabledSteps.indexOf(activeStepIndex) + 1]
    const clickOnNextSucceed = !getActiveStep().onValidate || getActiveStep().onValidate?.()
    const updatedStates = [...stepsStatus]
    if (nextStepIndex > -1 && clickOnNextSucceed) {
      onClickNext?.()
      setActiveStepIndex(nextStepIndex)
      updatedStates[nextStepIndex] = 'active'
    }
    updatedStates[activeStepIndex] = clickOnNextSucceed ? 'completed' : 'error'
    setStepsStatus(updatedStates)
  }, [activeStepIndex, enabledSteps, getActiveStep, onClickNext, stepsStatus])

  /**
   * Performs when the submit button is clicked
   */
  const handleSubmit = useCallback((): void => {
    onSubmit?.()
  }, [onSubmit])

  return (
    <div className="okp4-stepper-main">
      <div className="okp4-stepper-steps">
        {steps.map((step: DeepReadonly<Step>, index: number) => (
          <div className="okp4-step-main" key={index}>
            <div className={classNames('okp4-step-label', stepsStatus[index])}>
              <Typography
                as="div"
                fontSize="x-small"
                fontWeight={stepsStatus[index] === 'active' ? 'bold' : 'light'}
              >
                {step.label}
              </Typography>
            </div>
            <div className={classNames('okp4-step-state', stepsStatus[index])}></div>
          </div>
        ))}
      </div>
      <div
        className={classNames('okp4-stepper-content', {
          error: stepsStatus[activeStepIndex] === 'error'
        })}
      >
        {steps[activeStepIndex]?.content}
      </div>
      <div className="okp4-stepper-buttons">
        <div>
          {activeStepIndex > 0 && (
            <Button
              label={t('stepper:step.button.previous')}
              onClick={handleClickPrevious}
              size="small"
              variant="secondary"
            />
          )}
        </div>
        <div>
          {activeStepIndex < steps.length - 1 && (
            <Button
              label={t('stepper:step.button.next')}
              onClick={handleClickNext}
              size="small"
              variant="secondary"
            />
          )}
          {activeStepIndex === steps.length - 1 && (
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
