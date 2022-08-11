import type { DeepReadonly, UseState } from 'superTypes'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { InputBase } from 'ui/atoms/inputBase/InputBase'
import { Icon } from 'ui/atoms/icon/Icon'
import './datePicker.scss'
import { Calendar } from '../calendar/Calendar'
import type { DateFormat } from './dateHelper'
import {
  DateLength,
  DateRegexTyping,
  defaultRegexTyping,
  isValidDate,
  stringToDate,
  dateToString
} from './dateHelper'
import { Typography } from 'ui/atoms/typography/Typography'

export type DatePickerProps = {
  readonly value?: Date
  readonly onChange?: (date: DeepReadonly<Date>) => void
  readonly disabled?: boolean
  readonly format?: DateFormat
}

// eslint-disable-next-line max-lines-per-function
export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  disabled = false,
  format = 'dd/mm/yyyy'
}: DeepReadonly<DatePickerProps>): JSX.Element => {
  const inputElement = useRef<HTMLInputElement>(null)
  const [calendarOpened, setCalendarOpened]: UseState<boolean> = useState<boolean>(false)
  const [inputValue, setInputValue]: UseState<string> = useState<string>(
    value?.toLocaleDateString() ?? ''
  )
  const [hasError, setError]: UseState<boolean> = useState<boolean>(false)

  const regexTyping = useMemo(() => DateRegexTyping.get(format) ?? defaultRegexTyping, [format])

  const toggleCalendar = useCallback(() => {
    if (!disabled) {
      setCalendarOpened(!calendarOpened)
    }
  }, [disabled, calendarOpened])

  const handleSelectDate = useCallback(
    (date: DeepReadonly<Date>) => {
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
        if (isValidDate(date)) {
          onChange?.(date)
        } else {
          setError(true)
        }
      }
    },
    [regexTyping, format, onChange]
  )

  const CalendarIcon = (): JSX.Element => (
    <div className="okp4-date-picker-icon" onClick={toggleCalendar}>
      <Icon name="calendar" />
    </div>
  )

  return (
    <div className="okp4-date-picker-main">
      <InputBase
        disabled={disabled}
        hasError={hasError}
        inputRef={inputElement}
        maxLength={DateLength}
        onChange={handleInputChange}
        placeholder={format}
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
            initialDate={stringToDate(inputValue, format)}
            onSelect={handleSelectDate}
            weekStart="monday"
          />
        </div>
      )}
    </div>
  )
}
