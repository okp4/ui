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
 * The index of a step in a step array.
 */
export type StepIndex = number
/**
 * The ID of the step.
 */
export type StepId = string
/**
 * The status of a step in the Stepper.
 */
export type StepStatus = 'disabled' | 'invalid' | 'completed' | 'uncompleted'
type StepState = StepStatus | 'active'

export type Step = {
  /**
   * The ID of the step.
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
   * Callback method which allows to validate the step.
   */
  readonly onValidate?: () => boolean
}

export type StepperProps = {
  /**
   * The list of steps.
   */
  readonly steps: DeepReadonly<Step[]>
  /**
   * The index of the current step in the step array.
   */
  readonly current?: StepIndex

  /**
   * Defines if the previous button is disabled.
   */
  readonly isPreviousDisabled?: boolean

  /**
   * Defines if the next button is disabled.
   */
  readonly isNextDisabled?: boolean

  /**
   * Defines if the submit button is disabled.
   */
  readonly isSubmitDisabled?: boolean

  /**
   * Defines if the reset button is disabled.
   */
  readonly isResetDisabled?: boolean
  /**
   * The label of the submit button
   */
  readonly submitButtonLabel?: string
  /**
   * The label of the reset button.
   */
  readonly resetButtonLabel?: string
  /**
   * Defines if the submission succeed and allows to display the `successContent`.
   */
  readonly isSubmitSucceed?: boolean
  /**
   * The content displayed after submission succeed.
   */
  readonly successContent?: JSX.Element
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
  steps = [],
  current = 0,
  isPreviousDisabled,
  isNextDisabled,
  isSubmitDisabled,
  isResetDisabled,
  submitButtonLabel,
  resetButtonLabel,
  successContent,
  isSubmitSucceed,
  onPrevious,
  onNext,
  onSubmit,
  onReset
}: DeepReadonly<StepperProps>): JSX.Element => {
  const { t }: UseTranslationResponse = useTranslation()
  const { isXSmall, isSmall }: Breakpoints = useBreakpoint()
  const isMobile = (): boolean => isXSmall || isSmall

  const currentStep = useMemo(() => steps[current], [steps, current])

  const isFirstStep = useMemo(() => current === 0, [current])

  const isLastStep = useMemo(() => current === steps.length - 1, [steps, current])

  const getStepStatus = (step: DeepReadonly<Step>, index: StepIndex): StepState =>
    index === current
      ? step.status === 'completed'
        ? 'completed'
        : 'active'
      : step.status ?? 'uncompleted'

  const MobileHeader = (): JSX.Element => (
    <div className="okp4-stepper-progress">
      <div className={classNames('okp4-stepper-step-label', currentStep.status)}>
        <Typography as="div" fontSize="small" fontWeight="bold">
          {steps.indexOf(currentStep) < steps.length
            ? `${currentStep.label} (${steps.indexOf(currentStep) + 1}/${steps.length})`
            : `${steps[steps.length - 1].label} (${steps.indexOf(currentStep)}/${steps.length})`}
        </Typography>
      </div>
      <div className="okp4-stepper-step-states-mobile">
        {steps.map((step: DeepReadonly<Step>, index: StepIndex) => (
          <div
            className={classNames('okp4-stepper-step-state', getStepStatus(step, index))}
            key={index}
          ></div>
        ))}
      </div>
    </div>
  )

  const Buttons = (): JSX.Element => (
    <div className="okp4-stepper-buttons">
      <div>
        {!isFirstStep && (
          <Button
            disabled={isPreviousDisabled}
            icon={<Icon name="arrow-left" size={20} />}
            label={t('stepper:step.button.previous')}
            onClick={onPrevious}
            size="small"
            variant="icon"
          />
        )}
      </div>
      <div>
        {!isLastStep && (
          <Button
            disabled={isNextDisabled}
            icon={<Icon name="arrow-right" size={20} />}
            label={t('stepper:step.button.next')}
            onClick={onNext}
            size="small"
            variant="icon"
          />
        )}
        {isLastStep && currentStep.status !== 'completed' && (
          <Button
            backgroundColor="success"
            disabled={isSubmitDisabled}
            label={submitButtonLabel ?? t('stepper:step.button.submit')}
            onClick={onSubmit}
            size="small"
            variant="secondary"
          />
        )}
        {isLastStep && currentStep.status === 'completed' && (
          <Button
            backgroundColor="secondary"
            disabled={isResetDisabled}
            label={resetButtonLabel ?? t('stepper:step.button.reset')}
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
        {isMobile() ? (
          <MobileHeader />
        ) : (
          steps.map((step: DeepReadonly<Step>, index: StepIndex) => (
            <div className="okp4-stepper-progress" key={index}>
              <div className={classNames('okp4-stepper-step-label', getStepStatus(step, index))}>
                <Typography
                  as="div"
                  fontSize="x-small"
                  fontWeight={index === current ? 'bold' : 'light'}
                >
                  {step.label}
                </Typography>
              </div>
              <div
                className={classNames('okp4-stepper-step-state', getStepStatus(step, index))}
              ></div>
            </div>
          ))
        )}
      </div>
      <div
        className={classNames('okp4-stepper-body', {
          error: currentStep.status === 'invalid'
        })}
      >
        <div className="okp4-stepper-step-content">
          {isSubmitSucceed ? successContent : currentStep.content}
        </div>
        <Buttons />
      </div>
    </div>
  )
}
