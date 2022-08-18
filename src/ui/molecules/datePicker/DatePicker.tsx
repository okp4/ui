import type { DeepReadonly, UseState } from 'superTypes'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import './i18n/index'
import type { UseTranslationResponse } from 'hook/useTranslation'
import { useTranslation } from 'hook/useTranslation'
import { InputBase } from 'ui/atoms/inputBase/InputBase'
import { Icon } from 'ui/atoms/icon/Icon'
import './datePicker.scss'
import classNames from 'classnames'
import { Typography } from 'ui/atoms/typography/Typography'
import { Calendar } from '../calendar/Calendar'
import type { DateFormat } from '../../../dateUtils'
import type { Day } from '../calendar/calendarHelper'
import {
  DateRegexTyping,
  defaultRegexTyping,
  isDate,
  stringToDate,
  dateToString,
  isDateISO
} from '../../../dateUtils'

const DateLength = 10

export type DatePickerProps = {
  /**
   * The initial ISO date of the date picker.
   */
  readonly defaultValue?: string
  /**
   * Defines if the date picker is disabled or not.
   */
  readonly disabled?: boolean
  /**
   * The format of the dates.
   * For example : 'DD/MM/YYYY', 'YYYY-MM-DD', etc.
   */
  readonly format?: DateFormat
  /**
   * The first day of the week displayed by the calendar
   */
  readonly weekStart?: Day
  /**
   * Callback function called when the date changes.
   */
  readonly onChange?: (date: string) => void
}

// eslint-disable-next-line max-lines-per-function
export const DatePicker: React.FC<DatePickerProps> = ({
  defaultValue,
  disabled = false,
  format = 'dd/mm/yyyy',
  weekStart = 'monday',
  onChange
}: DeepReadonly<DatePickerProps>): JSX.Element => {
  const { t }: UseTranslationResponse = useTranslation()

  const inputElement = useRef<HTMLInputElement>(null)
  const [calendarOpened, setCalendarOpened]: UseState<boolean> = useState<boolean>(false)
  const [inputValue, setInputValue]: UseState<string> = useState<string>(
    defaultValue ? dateToString(defaultValue, format) ?? '' : ''
  )
  const [hasError, setError]: UseState<boolean> = useState<boolean>(false)

  const regexTyping = useMemo(() => DateRegexTyping.get(format) ?? defaultRegexTyping, [format])

  const toggleCalendar = useCallback(() => {
    if (!disabled) {
      setCalendarOpened(!calendarOpened)
    }
  }, [disabled, calendarOpened])

  const handleSelectDate = useCallback(
    (date: string) => {
      setInputValue(dateToString(date, format))
      setCalendarOpened(false)
      onChange?.(date)
    },
    [onChange, format]
  )

  const handleInputChange = useCallback(
    // lint rule bypassed because of type 'Element' is not compatible with readonly
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setError(!value.match(regexTyping))
      setInputValue(`${value}`)

      if (value.length === DateLength) {
        const date = stringToDate(value, format)
        if (isDate(date)) {
          const dateISO = date.toISOString()
          if (isDateISO(dateISO)) {
            setInputValue(dateToString(dateISO, format))
            onChange?.(dateISO)
          }
        } else {
          setError(true)
        }
      }
    },
    [regexTyping, format, onChange]
  )

  const CalendarIcon = (): JSX.Element => (
    <div className={classNames('okp4-date-picker-icon', { disabled })} onClick={toggleCalendar}>
      <Icon name="calendar" />
    </div>
  )

  return (
    <div className="okp4-date-picker-main">
      <InputBase
        disabled={disabled}
        hasError={hasError}
        inputRef={inputElement}
        onChange={handleInputChange}
        placeholder={t(`datepicker:datepicker.placeholder.${format}`)}
        rightIcon={CalendarIcon()}
        value={inputValue}
      />
      {hasError && (
        <Typography as="div" color={'error'} fontSize="x-small" fontWeight="bold" noWrap>
          {format}
        </Typography>
      )}
      {calendarOpened && (
        <div className="okp4-date-picker-calendar">
          <Calendar
            initialDate={stringToDate(inputValue, format) ?? new Date()}
            onSelect={handleSelectDate}
            weekStart={weekStart}
          />
        </div>
      )}
    </div>
  )
}
