import type { Reducer } from 'react'
import React, { useCallback, useReducer, useMemo } from 'react'
import type { DeepReadonly, UseReducer } from 'superTypes'
import './i18n/index'
import type { UseTranslationResponse } from 'hook/useTranslation'
import { useTranslation } from 'hook/useTranslation'
import * as CalendarHelper from './calendarHelper'
import { Icon } from '../icon/Icon'
import { Button } from '../button/Button'
import { Typography } from '../typography/Typography'
import './calendar.scss'
import classNames from 'classnames'

type CalendarState = {
  weekStart: CalendarHelper.Day
  monthCalendar: DeepReadonly<CalendarHelper.MonthCalendar>
  month: number
  year: number
  selectedDate: number
}

type CalendarAction =
  | { type: 'previousMonthClicked' }
  | { type: 'nextMonthClicked' }
  | { type: 'previousYearClicked' }
  | { type: 'nextYearClicked' }
  | { type: 'dateSelected'; payload: CalendarHelper.DayCalendar }

const initState = (
  initArg: DeepReadonly<{ date: Date; start: CalendarHelper.Day }>
): CalendarState => {
  const month = initArg.date.getMonth()
  const year = initArg.date.getFullYear()
  return {
    weekStart: initArg.start,
    month,
    year,
    monthCalendar: CalendarHelper.getMonthCalendar(year, month, initArg.start),
    selectedDate: new Date(year, month, initArg.date.getDate()).getTime()
  }
}

const goNextMonth = (state: DeepReadonly<CalendarState>, selectedDate?: number): CalendarState => {
  const month = state.month === 11 ? 0 : state.month + 1
  const year = state.month === 11 ? state.year + 1 : state.year
  const monthCalendar = CalendarHelper.getMonthCalendar(year, month, state.weekStart)
  return {
    ...state,
    month,
    year,
    monthCalendar,
    selectedDate: selectedDate ?? state.selectedDate
  }
}

const goPreviousMonth = (
  state: DeepReadonly<CalendarState>,
  selectedDate?: number
): CalendarState => {
  const month = state.month === 0 ? 11 : state.month - 1
  const year = state.month === 0 ? state.year - 1 : state.year
  const monthCalendar = CalendarHelper.getMonthCalendar(year, month, state.weekStart)
  return {
    ...state,
    month,
    year,
    monthCalendar,
    selectedDate: selectedDate ?? state.selectedDate
  }
}

const calendarReducer = (
  state: DeepReadonly<CalendarState>,
  action: DeepReadonly<CalendarAction>
): DeepReadonly<CalendarState> => {
  switch (action.type) {
    case 'previousMonthClicked':
      return goPreviousMonth(state)
    case 'nextMonthClicked':
      return goNextMonth(state)
    case 'previousYearClicked': {
      const year = state.year - 1
      const monthCalendar = CalendarHelper.getMonthCalendar(year, state.month, state.weekStart)
      return {
        ...state,
        month: state.month,
        year,
        monthCalendar,
        selectedDate: state.selectedDate
      }
    }
    case 'nextYearClicked': {
      const year = state.year + 1
      const monthCalendar = CalendarHelper.getMonthCalendar(year, state.month, state.weekStart)
      return {
        ...state,
        month: state.month,
        year,
        monthCalendar,
        selectedDate: state.selectedDate
      }
    }
    case 'dateSelected': {
      if (action.payload.month < 0) {
        return goPreviousMonth(state, action.payload.timestamp)
      }
      if (action.payload.month > 0) {
        return goNextMonth(state, action.payload.timestamp)
      }
      return {
        ...state,
        selectedDate: action.payload.timestamp
      }
    }
    default:
      return initState({ date: new Date(), start: state.weekStart })
  }
}

export type CalendarProps = {
  /**
   * The initial date.
   */
  readonly initialDate?: Date
  readonly weekStart?: CalendarHelper.Day
  /**
   * Callback function called when a date is selected.
   */
  readonly onSelect?: (date: DeepReadonly<Date>) => void
}

/**
 * Primary UI component for progress of a treatment.
 */
// eslint-disable-next-line max-lines-per-function
export const Calendar: React.FC<CalendarProps> = ({
  initialDate = new Date(),
  weekStart = 'sunday',
  onSelect
}: DeepReadonly<CalendarProps>): JSX.Element => {
  const { t }: UseTranslationResponse = useTranslation()

  const [state, dispatch]: UseReducer<CalendarState, CalendarAction> = useReducer<
    Reducer<CalendarState, CalendarAction>,
    DeepReadonly<{ date: Date; start: CalendarHelper.Day }>
  >(calendarReducer, { date: initialDate, start: weekStart }, initState)

  const days = useMemo(
    () =>
      CalendarHelper.DAYS.slice(CalendarHelper.DAYS.indexOf(weekStart)).concat(
        CalendarHelper.DAYS.slice(0, CalendarHelper.DAYS.indexOf(weekStart))
      ),
    [weekStart]
  )

  const handlePreviousMonth = useCallback(() => dispatch({ type: 'previousMonthClicked' }), [])

  const handleNextMonth = useCallback(() => dispatch({ type: 'nextMonthClicked' }), [])

  const handlePreviousYear = useCallback(() => dispatch({ type: 'previousYearClicked' }), [])

  const handleNextYear = useCallback(() => dispatch({ type: 'nextYearClicked' }), [])

  const handleSelectDate = useCallback(
    (day: DeepReadonly<CalendarHelper.DayCalendar>) => () => {
      onSelect?.(new Date(day.timestamp))
      dispatch({ type: 'dateSelected', payload: day })
    },
    [onSelect]
  )

  const isDateSelected = (day: DeepReadonly<CalendarHelper.DayCalendar>): boolean => {
    return state.selectedDate === day.timestamp
  }

  return (
    <div className="okp4-calendar-main">
      <div className="okp4-calendar-header">
        <div className="okp4-calendar-previous-year">
          <Button
            icon={<Icon name="previous" size={15} />}
            label="previousYear"
            onClick={handlePreviousYear}
            size="small"
            variant="icon"
          />
        </div>
        <div className="okp4-calendar-previous-month">
          <Button
            icon={<Icon name="arrow-left" size={15} />}
            label="previousMonth"
            onClick={handlePreviousMonth}
            size="small"
            variant="icon"
          />
        </div>

        <div className="okp4-calendar-year">
          <Typography as="span" fontSize="small">
            {state.year}
          </Typography>
        </div>
        <div className="okp4-calendar-month">
          <Typography as="span" fontSize="small">
            {t(`calendar:calendar.month.${CalendarHelper.MONTHS[state.month]}`)}
          </Typography>
        </div>
        <div className="okp4-calendar-next-month">
          <Button
            icon={<Icon name="arrow-right" size={15} />}
            label="nextMonth"
            onClick={handleNextMonth}
            size="small"
            variant="icon"
          />
        </div>
        <div className="okp4-calendar-next-year">
          <Button
            icon={<Icon name="next" size={15} />}
            label="nextYear"
            onClick={handleNextYear}
            size="small"
            variant="icon"
          />
        </div>
      </div>

      <div className="okp4-calendar-day-names">
        {days.map((day: string) => (
          <Typography as="div" fontSize="x-small" fontWeight="bold" key={day}>
            {t(`calendar:calendar.dayShort.${day}`)}
          </Typography>
        ))}
      </div>
      <div className="okp4-calendar-content">
        {state.monthCalendar.map(
          (weekCalendar: DeepReadonly<CalendarHelper.WeekCalendar>, index: number) => (
            <div className="okp4-calendar-week" key={index}>
              {weekCalendar.map(
                (dayCalendar: DeepReadonly<CalendarHelper.DayCalendar>, index: number) => (
                  <div
                    className={classNames('okp4-calendar-day-container', {
                      selected: isDateSelected(dayCalendar)
                    })}
                    key={index}
                    onClick={handleSelectDate(dayCalendar)}
                  >
                    <div className="okp4-calendar-day">
                      <Typography
                        as="div"
                        color={dayCalendar.month === 0 ? 'text' : 'disabled'}
                        fontSize="x-small"
                        fontWeight={isDateSelected(dayCalendar) ? 'bold' : 'light'}
                      >
                        {dayCalendar.dateOfMonth}
                      </Typography>
                    </div>
                  </div>
                )
              )}
            </div>
          )
        )}
      </div>
    </div>
  )
}
