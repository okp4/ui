import React from 'react'
import type { DeepReadonly } from 'superTypes'
import { Typography } from '../typography/Typography'
import './progressBar.scss'
import classNames from 'classnames'
import { toPercent as percent } from 'utils'

export type TProgressBarProps = DeepReadonly<{
  /**
   * Button contents.
   */
  readonly label?: string
  /**
   * The start value of the progress bar
   */
  readonly minValue?: number
  /**
   * The end value of the progress bar
   */
  readonly maxValue?: number
  /**
   * The current value of the progress bar
   */
  readonly currentValue?: number
  /**
   * Allows how to display the current value
   */
  readonly currentValueFormatter?: (currentValue: number) => string
  /**
   * Allows how to display the progress
   */
  readonly progressValueFormatter?: (
    currentValue: number,
    minValue?: number,
    maxValue?: number
  ) => string
  /**
   * An icon that can provide visual information
   */
  // TODO : change to the WIP Icon Component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly icon?: any
}>

/**
 * Primary UI component for user interaction.
 */
// eslint-disable-next-line max-lines-per-function
export const ProgressBar: React.FC<TProgressBarProps> = ({
  label,
  minValue = 0,
  maxValue = 100,
  currentValue,
  currentValueFormatter: formatCurrentValue = (currentValue: number): string => `${currentValue}`,
  progressValueFormatter: formatProgress,
  icon
}: TProgressBarProps): JSX.Element => {
  const isUndetermined = (): boolean => (!currentValue && currentValue !== 0) || maxValue < minValue

  const toPercent = (): number => {
    if (isUndetermined()) {
      return 0
    }
    return percent(currentValue ?? 0, minValue, maxValue)
  }

  const defaultProgressValueFormatter = (): string => `${toPercent().toFixed(2)} %`

  return (
    <div className="okp4-progressbar-main">
      {label && (
        <div className="okp4-progressbar-label">
          <Typography as="div" color="text" fontSize="small" fontWeight="bold">
            {label}
          </Typography>
        </div>
      )}
      {!isUndetermined() && (
        <div className="okp4-progressbar-value">
          <Typography as="div" color="text" fontSize="small" fontWeight="light">
            {formatCurrentValue(currentValue ?? 0)}
          </Typography>
        </div>
      )}
      {!isUndetermined() && (
        <div className="okp4-progressbar-progress">
          <Typography as="div" color="text" fontSize="small" fontWeight="bold">
            {formatProgress
              ? formatProgress(currentValue ?? 0, minValue, maxValue)
              : defaultProgressValueFormatter()}
          </Typography>
        </div>
      )}
      <div className="okp4-progressbar-bar">
        <div className="okp4-progressbar-bar-container">
          <div
            className={classNames(
              'okp4-progressbar-bar-filler',
              isUndetermined() && 'okp4-progressbar-bar-filler--undetermined'
            )}
            style={{ width: `${toPercent()}%` }}
          ></div>
        </div>
      </div>
      <div className="okp4-progressbar-icon">{icon}</div>
    </div>
  )
}
