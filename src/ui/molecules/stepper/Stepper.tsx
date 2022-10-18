import classNames from 'classnames'
import type { Breakpoints } from 'hook/useBreakpoint'
import { useBreakpoint } from 'hook/useBreakpoint'
import type { UseTranslationResponse } from 'hook/useTranslation'
import { useTranslation } from 'hook/useTranslation'
import React, { useMemo } from 'react'
import type { DeepReadonly } from 'superTypes'
import { Button } from 'ui/atoms/button/Button'
import { Icon } from 'ui/atoms/icon/Icon'
import { Typography } from 'ui/atoms/typography/Typography'
import './i18n/index'
import './stepper.scss'

/**
 * The id of the step.
 */
export type StepId = string
/**
 * The status of a step in the Stepper.
 */
export type StepStatus = 'disabled' | 'invalid' | 'completed' | 'uncompleted'

export type Step = {
  /**
   * The id of the step.
   */
  readonly id: StepId
  /**
   * The title of the step.
   */
  readonly label?: string
  /**
   * The status of the step.
   */
  readonly status?: StepStatus
  /**
   * The content of the step.
   */
  readonly content?: JSX.Element
  /**
   * Callback function which allows to validate the step.
   */
  readonly onValidate?: () => boolean
}

export type StepperProps = {
  /**
   * The list of steps.
   */
  readonly steps: Step[]
  /**
   * The id of the current step.
   */
  readonly currentStepId?: StepId
  /**
   * Defines if the submit button is disabled.
   */
  readonly isSubmitDisabled?: boolean
  /**
   * The label of the submit button
   */
  readonly submitButtonLabel?: string
  /**
   * The label of the reset button.
   */
  readonly resetButtonLabel?: string
  /**
   * Callback method called when previous button is clicked.
   */
  readonly onPrevious?: () => void
  /**
   * Callback method called when next button is clicked.
   */
  readonly onNext?: () => void
  /**
   * Callback method called when clicking on the submit button in the last step.
   */
  readonly onSubmit?: () => void
  /**
   * Callback method called when clicking on the reset button after submission succeed in the last step.
   */
  readonly onReset?: () => void
}

// eslint-disable-next-line max-lines-per-function
export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStepId,
  isSubmitDisabled,
  submitButtonLabel,
  resetButtonLabel,
  onPrevious,
  onNext,
  onSubmit,
  onReset
}: DeepReadonly<StepperProps>): JSX.Element => {
  const { t }: UseTranslationResponse = useTranslation()
  const { isXSmall, isSmall }: Breakpoints = useBreakpoint()

  const isMobile = useMemo(() => isXSmall || isSmall, [isXSmall, isSmall])

  const currentStep = useMemo(
    () => steps.find((step: DeepReadonly<Step>) => step.id === currentStepId),
    [steps, currentStepId]
  )

  const isFirstStep = useMemo(() => currentStepId === steps.at(0)?.id, [steps, currentStepId])

  const isLastStep = useMemo(() => currentStepId === steps.at(-1)?.id, [steps, currentStepId])

  const isCurrentStepCompleted = useMemo(
    () => currentStep && currentStep.status === 'completed',
    [currentStep]
  )

  const getStepStatus = (step: DeepReadonly<Step>): StepStatus | 'active' => {
    if (isLastStep && step.status === 'completed') {
      return 'completed'
    }
    if (step.id === currentStepId) {
      return 'active'
    }
    return step.status ?? 'uncompleted'
  }

  const MobileHeader = (): JSX.Element | null =>
    currentStep ? (
      <div className="okp4-stepper-progress">
        <div className={classNames('okp4-stepper-step-label', getStepStatus(currentStep))}>
          <Typography fontSize="small" fontWeight="bold">
            {`${currentStep.label} (${steps.indexOf(currentStep) + 1}/${steps.length})`}
          </Typography>
        </div>
        <div className="okp4-stepper-step-states-mobile">
          {steps.map(
            (step: DeepReadonly<Step>): JSX.Element => (
              <div
                className={classNames('okp4-stepper-step-state', getStepStatus(step))}
                key={step.id}
              />
            )
          )}
        </div>
      </div>
    ) : null

  const Buttons = (): JSX.Element => (
    <div className="okp4-stepper-buttons">
      <div>
        {!isFirstStep && (
          <Button
            icon={<Icon name="arrow-left" size={20} />}
            label={t('stepper:stepper.button.previous')}
            onClick={onPrevious}
            size="small"
            variant="icon"
          />
        )}
      </div>
      <div>
        {!isLastStep && (
          <Button
            icon={<Icon name="arrow-right" size={20} />}
            label={t('stepper:stepper.button.next')}
            onClick={onNext}
            size="small"
            variant="icon"
          />
        )}
        {isLastStep && !isCurrentStepCompleted && (
          <Button
            backgroundColor="success"
            disabled={isSubmitDisabled}
            label={submitButtonLabel ?? t('stepper:stepper.button.submit')}
            onClick={onSubmit}
            size="small"
            variant="secondary"
          />
        )}
        {isLastStep && isCurrentStepCompleted && (
          <Button
            backgroundColor="secondary"
            label={resetButtonLabel ?? t('stepper:stepper.button.reset')}
            onClick={onReset}
            size="small"
            variant="secondary"
          />
        )}
      </div>
    </div>
  )

  return (
    <div className="okp4-stepper-main">
      <div className="okp4-stepper-header">
        {isMobile ? (
          <MobileHeader />
        ) : (
          steps.map(
            (step: DeepReadonly<Step>): JSX.Element => (
              <div className="okp4-stepper-progress" key={step.id}>
                <div className={classNames('okp4-stepper-step-label', getStepStatus(step))}>
                  <Typography
                    fontSize="x-small"
                    fontWeight={
                      step.id === currentStepId && step.status !== 'completed' ? 'bold' : 'light'
                    }
                  >
                    {step.label}
                  </Typography>
                </div>
                <div className={classNames('okp4-stepper-step-state', getStepStatus(step))} />
              </div>
            )
          )
        )}
      </div>
      <div
        className={classNames('okp4-stepper-body', {
          error: currentStep && currentStep.status === 'invalid'
        })}
      >
        <div className="okp4-stepper-step-content">{currentStep?.content}</div>
        <Buttons />
      </div>
    </div>
  )
}
