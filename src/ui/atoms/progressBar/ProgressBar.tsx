import React from 'react'
import type { DeepReadonly } from 'superTypes'
import { Typography } from '../typography/Typography'
import './progressBar.scss'
import classNames from 'classnames'
import { toPercent } from 'utils'

export type ProgressBarProps = {
  /**
   * The progress bar title.
   */
  readonly label?: string
  /**
   * The start value of the progress bar.
   */
  readonly minValue?: number
  /**
   * The end value of the progress bar.
   */
  readonly maxValue?: number
  /**
   * The current value of the progress bar.
   */
  readonly currentValue?: number
  /**
   * Allows to define how to display the current value.
   *
   * @param currentValue The current value of the progress bar.
   * @return Returns the formatted current value.
   */
  readonly currentValueFormatter?: (currentValue: number) => string
  /**
   * Allows to define how to display the progress
   *
   * @param currentValue The current value of the progress bar.
   * @param minValue The start value of the progress bar.
   * @param maxValue The end value of the progress bar.
   * @return Returns the formatted progress value.
   */
  readonly progressValueFormatter?: (
    currentValue: number,
    minValue?: number,
    maxValue?: number
  ) => string
  /**
   * An icon that can provide visual information
   */
  readonly icon?: Readonly<JSX.Element>
}

/**
 * Returns the current value in string.
 *
 * @param currentValue The current value.
 * @returns The current value in string.
 */
export const defaultValueFormatter = (currentValue: number): string => `${currentValue}`

/**
 * Formats the progression in percentage.
 *
 * @param currentValue The value of the progression.
 * @param minValue The start value of the scale.
 * @param maxValue The end value of the scale.
 * @returns The current percentage progress.
 */
export const defaultProgressValueFormatter = (
  currentValue: number,
  minValue?: number,
  maxValue?: number
): string => `${toPercent(currentValue, minValue ?? 0, maxValue ?? 100).toFixed(2)} %`

/**
 * Primary UI component for progress of a treatment.
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  minValue = 0,
  maxValue = 100,
  currentValue,
  currentValueFormatter = defaultValueFormatter,
  progressValueFormatter = defaultProgressValueFormatter,
  icon
}: DeepReadonly<ProgressBarProps>): JSX.Element => {
  const isUndetermined = (): boolean => (!currentValue && currentValue !== 0) || maxValue < minValue
  const current = currentValue ?? 0

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
        <>
          <div className="okp4-progressbar-value">
            <Typography as="div" color="text" fontSize="small" fontWeight="light">
              {currentValueFormatter(current)}
            </Typography>
          </div>
          <div className="okp4-progressbar-progress">
            <Typography as="div" color="text" fontSize="small" fontWeight="bold">
              {progressValueFormatter(current, minValue, maxValue)}
            </Typography>
          </div>
        </>
      )}
      <div className="okp4-progressbar-bar">
        <div className="okp4-progressbar-bar-container">
          <div
            className={classNames('okp4-progressbar-bar-filler', {
              undetermined: isUndetermined()
            })}
            style={{ width: `${toPercent(current, minValue, maxValue)}%` }}
          ></div>
        </div>
      </div>
      {icon && <div className="okp4-progressbar-icon">{icon}</div>}
    </div>
  )
}
