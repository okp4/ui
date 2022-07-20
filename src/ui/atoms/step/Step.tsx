import classNames from 'classnames'
import React from 'react'
import type { DeepReadonly } from 'superTypes'
import { Typography } from '../typography/Typography'
import './step.scss'

export type StepProps = {
  /**
   * The step label
   */
  readonly label: string

  readonly active?: boolean
  readonly disabled?: boolean
  readonly error?: boolean
  readonly completed?: boolean
}

/**
 * Primary UI component for user interaction.
 */
export const Step: React.FC<StepProps> = ({
  label,
  active = false,
  disabled = false,
  error = false,
  completed = false
}: DeepReadonly<StepProps>): JSX.Element => {
  const getState = (): 'active' | 'disabled' | 'error' | 'completed' | 'uncompleted' => {
    if (disabled) {
      return 'disabled'
    }
    if (error) {
      return 'error'
    }
    if (active) {
      return 'active'
    }
    if (completed) {
      return 'completed'
    }
    return 'uncompleted'
  }

  return (
    <div className="okp4-step-main">
      <div className={classNames('okp4-step-label', getState())}>
        <Typography
          as="div"
          fontSize="x-small"
          fontWeight={getState() === 'active' ? 'bold' : 'light'}
        >
          {label}
        </Typography>
      </div>
      <div className={classNames('okp4-step-state', getState())}></div>
    </div>
  )
}
