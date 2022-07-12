import classNames from 'classnames'
import React from 'react'
import type { DeepReadonly } from 'superTypes'
import { Typography } from '../typography/Typography'
import './stepper.scss'

export type TStepProps = {
  /**
   * The step label
   */
  readonly label?: string
  /**
   * The step state
   */
  readonly state?: 'active' | 'uncompleted' | 'completed' | 'error'
}

export type TStepperProps = DeepReadonly<{
  /**
   * The list of the steps
   */
  readonly steps: TStepProps[]
}>

/**
 * Primary UI component for user interaction.
 */
export const Stepper: React.FC<TStepperProps> = ({ steps }: TStepperProps): JSX.Element => {
  return (
    <div className="okp4-stepper-main">
      {steps.map((step: TStepProps, index: number) => (
        <div className="okp4-stepper-step" key={index}>
          <div
            className={classNames(
              'okp4-stepper-step--label',
              `okp4-stepper-step--label--${step.state ?? 'uncompleted'}`
            )}
          >
            <Typography
              as="div"
              fontSize="x-small"
              fontWeight={step.state === 'active' ? 'bold' : 'light'}
            >
              {step.label}
            </Typography>
          </div>
          <div
            className={classNames(
              'okp4-stepper-step--state',
              `okp4-stepper-step--state--${step.state ?? 'uncompleted'}`
            )}
          ></div>
        </div>
      ))}
    </div>
  )
}
