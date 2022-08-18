import React, { useCallback, useReducer, useMemo } from 'react'
import type { Reducer } from 'react'
import type { DeepReadonly, UseReducer } from 'superTypes'
import './i18n/index'
import type { UseTranslationResponse } from 'hook/useTranslation'
import { useTranslation } from 'hook/useTranslation'
import * as CalendarHelper from './calendarHelper'
import { Icon } from '../../atoms/icon/Icon'
import { Button } from '../../atoms/button/Button'
import { Typography } from '../../atoms/typography/Typography'
import './calendar.scss'
import classNames from 'classnames'

type CalendarState = {
  weekStart: CalendarHelper.Day
  monthCalendar: DeepReadonly<CalendarHelper.MonthCalendar>
  month: number
  year: number
  selectedDate: string
}

type CalendarAction =
  | { type: 'previousMonthClicked' }
  | { type: 'nextMonthClicked' }
  | { type: 'previousYearClicked' }
  | { type: 'nextYearClicked' }
  | { type: 'dateSelected'; payload: CalendarHelper.DayCalendar }

const initState = (
  initArg: DeepReadonly<{ date: string | Date; start: CalendarHelper.Day }>
): CalendarState => {
  const d = new Date(initArg.date)
  const month = d.getMonth()
  const year = d.getFullYear()
  return {
    weekStart: initArg.start,
    month,
    year,
    monthCalendar: CalendarHelper.getCalendarMonth(year, month, initArg.start),
    selectedDate: new Date(year, month, d.getDate()).toISOString()
  }
}

const goNextMonth = (state: DeepReadonly<CalendarState>, selectedDate?: string): CalendarState => {
  const month = state.month === CalendarHelper.December ? CalendarHelper.January : state.month + 1
  const year = state.month === CalendarHelper.December ? state.year + 1 : state.year
  const monthCalendar = CalendarHelper.getCalendarMonth(year, month, state.weekStart)
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
  selectedDate?: string
): CalendarState => {
  const month = state.month === CalendarHelper.January ? CalendarHelper.December : state.month - 1
  const year = state.month === CalendarHelper.January ? state.year - 1 : state.year
  const monthCalendar = CalendarHelper.getCalendarMonth(year, month, state.weekStart)
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
      const monthCalendar = CalendarHelper.getCalendarMonth(year, state.month, state.weekStart)
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
      const monthCalendar = CalendarHelper.getCalendarMonth(year, state.month, state.weekStart)
      return {
        ...state,
        month: state.month,
        year,
        monthCalendar,
        selectedDate: state.selectedDate
      }
    }
    case 'dateSelected': {
      if (action.payload.month === 'prev') {
        return goPreviousMonth(state, action.payload.dateISO)
      }
      if (action.payload.month === 'next') {
        return goNextMonth(state, action.payload.dateISO)
      }
      return {
        ...state,
        selectedDate: action.payload.dateISO
      }
    }
    default:
      return initState({ date: new Date().toISOString(), start: state.weekStart })
  }
}

export type CalendarProps = {
  /**
   * The initial date in ISO format or Javascript Date.
   */
  readonly initialDate?: string | Date
  /**
   * The fisrt day of the week.
   */
  readonly weekStart?: CalendarHelper.Day
  /**
   * Callback function called when a date (ISO format) is selected.
   */
  readonly onSelect?: (date: string) => void
}

// eslint-disable-next-line max-lines-per-function
export const Calendar: React.FC<CalendarProps> = ({
  initialDate = new Date().toISOString(),
  weekStart = 'sunday',
  onSelect
}: DeepReadonly<CalendarProps>): JSX.Element => {
  const { t }: UseTranslationResponse = useTranslation()

  const [state, dispatch]: UseReducer<CalendarState, CalendarAction> = useReducer<
    Reducer<CalendarState, CalendarAction>,
    DeepReadonly<{ date: string | Date; start: CalendarHelper.Day }>
  >(calendarReducer, { date: initialDate, start: weekStart }, initState)

  const days = useMemo(() => CalendarHelper.getDays(weekStart), [weekStart])

  const handlePreviousMonth = useCallback(() => dispatch({ type: 'previousMonthClicked' }), [])

  const handleNextMonth = useCallback(() => dispatch({ type: 'nextMonthClicked' }), [])

  const handlePreviousYear = useCallback(() => dispatch({ type: 'previousYearClicked' }), [])

  const handleNextYear = useCallback(() => dispatch({ type: 'nextYearClicked' }), [])

  const handleSelectDate = useCallback(
    (day: DeepReadonly<CalendarHelper.DayCalendar>) => () => {
      onSelect?.(day.dateISO)
      dispatch({ type: 'dateSelected', payload: day })
    },
    [onSelect]
  )

  const isDateSelected = (day: DeepReadonly<CalendarHelper.DayCalendar>): boolean => {
    return state.selectedDate === day.dateISO
  }

  return (
    <div className="okp4-calendar-main">
      <div className="okp4-calendar-header">
        <div className="okp4-calendar-previous-year">
          <Button
            icon={<Icon name="arrow-down" size={15} />}
            label={t(`calendar:calendar.button.previousYear`)}
            onClick={handlePreviousYear}
            size="small"
            variant="icon"
          />
        </div>
        <div className="okp4-calendar-previous-month">
          <Button
            icon={<Icon name="arrow-left" size={15} />}
            label={t(`calendar:calendar.button.previousMonth`)}
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
            label={t(`calendar:calendar.button.nextMonth`)}
            onClick={handleNextMonth}
            size="small"
            variant="icon"
          />
        </div>
        <div className="okp4-calendar-next-year">
          <Button
            icon={<Icon name="arrow-up" size={15} />}
            label={t(`calendar:calendar.button.nextYear`)}
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
                        color={dayCalendar.month === 'curr' ? 'text' : 'disabled'}
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
