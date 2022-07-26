import React, { useCallback, useMemo, useState, useEffect } from 'react'
import type { DeepReadonly, StateHook } from 'superTypes'
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
  const [enabledSteps, setEnabledSteps]: StateHook<StepIndex[]> = useState<StepIndex[]>([])
  const [stepsStatus, setStepsStatus]: StateHook<StepStatus[]> = useState<StepStatus[]>([])
  const [activeStepIndex, setActiveStepIndex]: StateHook<StepIndex> = useState(active)
  const [stepsForDependency, setDependency]: StateHook<(InitialStatus | undefined)[]> = useState<
    (InitialStatus | undefined)[]
  >([])

  const getStepStatus = (step: DeepReadonly<Step>, isActive: boolean): StepStatus =>
    isActive ? 'active' : step.status ?? 'uncompleted'

  useEffect(() => {
    const newStepsForDependency = steps.map(step => step.status)
    if (JSON.stringify(newStepsForDependency) !== JSON.stringify(stepsForDependency)) {
      setDependency(newStepsForDependency)
    }
  }, [steps])

  useEffect(() => {
    setEnabledSteps([
      ...steps.reduce((acc: DeepReadonly<StepIndex[]>, curr: DeepReadonly<Step>, index: number) => {
        return curr.status !== 'disabled' ? [...acc, index] : acc
      }, [])
    ])
    setStepsStatus(
      steps.map((step: DeepReadonly<Step>, index: number) => getStepStatus(step, index === active))
    )
    setActiveStepIndex(active)
  }, [stepsForDependency, active])

  const activeStep = useMemo(
    (): DeepReadonly<Step> => steps[activeStepIndex],
    [activeStepIndex, stepsForDependency]
  )

  /**
   * Performs when the previous button is clicked
   */
  const handlePreviousClick = useCallback((): void => {
    const previousStepIndex = enabledSteps[enabledSteps.indexOf(activeStepIndex) - 1]
    if (previousStepIndex > -1) {
      setActiveStepIndex(previousStepIndex)
      const updatedStates = [...stepsStatus]
      updatedStates[activeStepIndex] = 'uncompleted'
      updatedStates[previousStepIndex] = 'active'
      console.log({ updatedStates })
      setStepsStatus(updatedStates)
    }
  }, [activeStepIndex, enabledSteps, stepsStatus])

  /**
   * Performs when the next button is clicked
   */
  const handleNextClick = useCallback((): void => {
    const nextStepIndex = enabledSteps[enabledSteps.indexOf(activeStepIndex) + 1]
    const clickOnNextSucceed = !activeStep.onValidate || activeStep.onValidate?.()
    const updatedStates = [...stepsStatus]
    if (nextStepIndex > -1 && clickOnNextSucceed) {
      onNext?.()
      setActiveStepIndex(nextStepIndex)
      updatedStates[nextStepIndex] = 'active'
    }
    updatedStates[activeStepIndex] = clickOnNextSucceed ? 'completed' : 'error'
    setStepsStatus(updatedStates)
  }, [onNext, activeStepIndex, enabledSteps, activeStep, stepsStatus])

  /**
   * Performs when the submit button is clicked
   */
  const handleSubmit = useCallback((): void => {
    onSubmit?.()
    const updatedStates = [...stepsStatus]
    updatedStates[activeStepIndex] = 'completed'
    setStepsStatus(updatedStates)
  }, [onSubmit, activeStepIndex, stepsStatus])

  return (
    <div className="okp4-stepper-main">
      <div className="okp4-stepper-steps">
        {steps.map((step: DeepReadonly<Step>, index: number) => (
          <div className="okp4-step-header" key={index}>
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
              onClick={handlePreviousClick}
              size="small"
              variant="secondary"
            />
          )}
        </div>
        <div>
          {activeStepIndex < steps.length - 1 && (
            <Button
              label={t('stepper:step.button.next')}
              onClick={handleNextClick}
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
