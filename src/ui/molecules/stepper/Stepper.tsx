import React, { useCallback, useState } from 'react'
import type { DeepReadonly, State } from 'superTypes'
import './stepper.scss'
import { Step } from 'ui/atoms/step/Step'
import { Button } from '../../atoms/button/Button'
import classNames from 'classnames'

export type Step = {
  /**
   * The title of the step
   */
  readonly label: string
  /**
   * Defines if the step is disabled
   */
  readonly disabled?: boolean
  /**
   * Defines if the step is completed
   */
  readonly completed?: boolean
  /**
   * Defines if the step contains errors
   */
  readonly error?: boolean
  /**
   * The content of the step
   */
  readonly content?: JSX.Element
  /**
   * Defines if the previous button is disabled
   */
  readonly disablePreviousButton?: boolean
  /**
   * Defines if the next button is disabled
   */
  readonly disableNextButton?: boolean
  /**
   * The label of the previous button
   */
  readonly previousButtonLabel?: string
  /**
   * The label of the next button
   */
  readonly nextButtonLabel?: string
  /**
   * Callback method called on click on previous button
   */
  readonly onClickPrevious?: () => boolean
  /**
   * Callback method called on click on next button
   */
  readonly onClickNext?: () => boolean
}

export type StepperProps = {
  /**
   * The list of the steps
   */
  readonly steps: Step[]
  /**
   * The index of the active step
   */
  readonly active?: number
  /**
   * The label of the next button
   */
  readonly submitButtonLabel?: string
  /**
   * Callback method called when click on the submit button on the last step
   */
  readonly onSubmit?: () => void
}

/**
 * Primary UI component for user interaction.
 */
// eslint-disable-next-line max-lines-per-function
export const Stepper: React.FC<StepperProps> = ({
  steps,
  active = 0,
  submitButtonLabel,
  onSubmit
}: DeepReadonly<StepperProps>): JSX.Element => {
  const [stepArray, setStepArray]: State<DeepReadonly<Step[]>> = useState(steps)
  const [activeStep, setActiveStep]: State<{ step: Step; index: number }> = useState<{
    step: Step
    index: number
  }>({ step: steps[active], index: active })

  const handlePrevious = useCallback((): void => {
    const index =
      stepArray.length -
      1 -
      stepArray
        .slice()
        .reverse()
        .findIndex(
          (step: DeepReadonly<Step>, index: number) =>
            !step.disabled && index > stepArray.length - 1 - activeStep.index
        )
    if (index > -1) {
      const step = stepArray[index]
      if (!activeStep.step.onClickPrevious || activeStep.step.onClickPrevious()) {
        setActiveStep({ step, index })
      }
    }
  }, [activeStep, stepArray])

  const handleNext = useCallback((): void => {
    const index = stepArray.findIndex(
      (step: DeepReadonly<Step>, index: number) => !step.disabled && index > activeStep.index
    )
    if (index > -1) {
      const step = stepArray[index]
      if (!activeStep.step.onClickNext || activeStep.step.onClickNext()) {
        setStepArray(
          stepArray.map((step: DeepReadonly<Step>, index: number) =>
            index === activeStep.index
              ? {
                  ...activeStep.step,
                  completed: true
                }
              : step
          )
        )

        setActiveStep({ step, index })
      } else {
        setStepArray(
          stepArray.map((step: DeepReadonly<Step>, index: number) =>
            index === activeStep.index
              ? {
                  ...activeStep.step,
                  error: true
                }
              : step
          )
        )
      }
    }
  }, [activeStep, stepArray])

  const handleSubmit = useCallback((): void => {
    onSubmit?.()
  }, [onSubmit])

  return (
    <div className="okp4-stepper-main">
      <div className="okp4-stepper-steps">
        {stepArray.map((step: DeepReadonly<Step>, index: number) => (
          <Step // TODO: comment gérer les states ?
            active={index === activeStep.index}
            completed={step.completed}
            disabled={step.disabled}
            error={step.error}
            key={index}
            label={step.label}
          />
        ))}
      </div>
      <div
        className={classNames('okp4-stepper-content', { error: stepArray[activeStep.index].error })}
      >
        {activeStep.step.content}
      </div>
      <div className="okp4-stepper-buttons">
        <div className="okp4-stepper-buttons--previous">
          {activeStep.index > 0 && (
            <Button
              disabled={activeStep.step.disablePreviousButton}
              label={activeStep.step.previousButtonLabel ?? 'Prev'}
              onClick={handlePrevious}
              size="small"
              variant="secondary"
            />
          )}
        </div>
        <div className="okp4-stepper-buttons--next">
          {activeStep.index < steps.length - 1 && (
            <Button
              disabled={activeStep.step.disableNextButton}
              label={activeStep.step.nextButtonLabel ?? 'Next'}
              onClick={handleNext}
              size="small"
              variant="secondary"
            />
          )}
          {activeStep.index === steps.length - 1 && (
            <Button
              backgroundColor="success"
              label={submitButtonLabel ?? 'Submit'}
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
