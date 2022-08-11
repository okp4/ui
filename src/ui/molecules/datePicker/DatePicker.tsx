import type { DeepReadonly, UseState } from 'superTypes'
import React, { useCallback, useState } from 'react'
import { InputBase } from 'ui/atoms/inputBase/InputBase'
import { Icon } from 'ui/atoms/icon/Icon'
import './datePicker.scss'
import { Calendar } from '../calendar/Calendar'

export type DatePickerProps = {
  readonly value?: Date
  readonly onChange?: (date: DeepReadonly<Date>) => void
  readonly disabled?: boolean
}

// eslint-disable-next-line max-lines-per-function
export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  disabled = false
}: DeepReadonly<DatePickerProps>): JSX.Element => {
  const [calendarOpened, setCalendarOpened]: UseState<boolean> = useState<boolean>(false)
  const [inputValue, setInputValue]: UseState<string> = useState<string>(
    value?.toLocaleDateString() ?? ''
  )
  const toggleCalendar = useCallback(() => {
    if (!disabled) {
      setCalendarOpened(!calendarOpened)
    }
  }, [disabled, calendarOpened])

  const handleSelectDate = useCallback(
    (date: DeepReadonly<Date>) => {
      onChange?.(date)
      setInputValue(date.toLocaleDateString())
      setCalendarOpened(false)
    },
    [onChange]
  )

  // HTMLInputElement can't be readonly
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }, [])

  const CalendarIcon = (): JSX.Element => (
    <div className="okp4-date-picker-icon" onClick={toggleCalendar}>
      <Icon name="calendar" />
    </div>
  )

  return (
    <div className="okp4-date-picker-main">
      <InputBase
        disabled={disabled}
        onChange={handleChange}
        rightIcon={CalendarIcon()}
        value={inputValue}
      />
      {calendarOpened && (
        <div className="okp4-date-picker-calendar">
          <Calendar initialDate={value} onSelect={handleSelectDate} weekStart="monday" />
        </div>
      )}
    </div>
  )
}
