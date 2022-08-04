import React, { useEffect, useState } from 'react'
import type { DeepReadonly } from 'superTypes'
import { Typography } from '../typography/Typography'
import './calendar.scss'
import * as CalendarHelper from './calendar'
import { UseState } from '../../../superTypes'

export type CalendarProps = {
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
}

/**
 * Primary UI component for progress of a treatment.
 */
export const Calendar: React.FC<CalendarProps> = ({
  label
}: DeepReadonly<CalendarProps>): JSX.Element => {
  type CalendarState = {
    monthCalendar: MonthCalendar
    selectedDay: any
    month: number
    year: number
  }
  const [state, setState]: UseState<CalendarState> = useState<CalendarState>({
    monthCalendar: [],
    selectedDay: null,
    month: 7,
    year: 2022
  })

  type DayCalendar = {
    dateOfMonth: number
    isInMonth: boolean
  }

  type MonthCalendar = DayCalendar[][]

  const getDayCalendar = (
    year: number,
    month: number,
    row: number,
    col: number,
    firstDay: number,
    numberOfDays: number
  ): DayCalendar => {
    const indexInMonth = row * 7 + col
    const isInMonth = indexInMonth >= firstDay && indexInMonth <= numberOfDays
    const date = indexInMonth - firstDay
    const previousMonth = month === 0 ? 11 : month - 1
    const previousYear = month === 0 ? year - 1 : year
    const previousMonthNumberOfDays = CalendarHelper.getNumberOfDays(previousYear, previousMonth)
    const dateOfMonth = (date < 0 ? previousMonthNumberOfDays + date : date % numberOfDays) + 1
    return {
      dateOfMonth,
      isInMonth
    }
  }

  const getMonthCalendar = (year: number, month: number) => {
    const firstDay = CalendarHelper.getMonthStart(year, month)
    console.log({ firstDay })
    const numberOfDays = CalendarHelper.getNumberOfDays(year, month)
    const monthCalendar: MonthCalendar = []
    for (let row = 0; row < 6; row++) {
      const weekCalendar: DayCalendar[] = []
      for (let col = 0; col < 7; col++) {
        weekCalendar.push(getDayCalendar(year, month, row, col, firstDay, numberOfDays))
      }
      monthCalendar.push(weekCalendar)
    }
    return monthCalendar
  }

  useEffect(() => {
    setState({
      ...state,
      monthCalendar: getMonthCalendar(state.year, state.month)
    })
  }, [])

  return (
    <div className="okp4-calendar-main">
      {state.monthCalendar.map((weekCalendar: DayCalendar[]) => (
        <div className="okp4-calendar-week">
          {weekCalendar.map((dayCalendar: DayCalendar) => (
            <span>{dayCalendar.dateOfMonth}</span>
          ))}
        </div>
      ))}
    </div>
  )
}
