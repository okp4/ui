import { OrderedMap } from 'immutable'

export type Day = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'

export const DAYS: OrderedMap<Day, number> = OrderedMap([
  ['sunday', 0],
  ['monday', 1],
  ['tuesday', 2],
  ['wednesday', 3],
  ['thursday', 4],
  ['friday', 5],
  ['saturday', 6]
])

export const WEEK_DAYS_NUMBER = 7

export const WEEKS = [1, 2, 3, 4, 5, 6]

export const MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
]

export const January = 0
export const December = 11

export type Month = number
export type Year = number

export const getMonthStart = (year: Year, month: Month): number => new Date(year, month).getDay()

export const getNumberOfDays = (year: Year, month: Month): number =>
  42 - new Date(year, month, 42).getDate()

export type DayCalendar = {
  dateOfMonth: number
  month: 'prev' | 'curr' | 'next'
  timestamp: number
}

export type WeekCalendar = DayCalendar[]

export type MonthCalendar = WeekCalendar[]

export const getCalendarDay = (
  year: Year,
  month: Month,
  indexInMonth: number,
  firstDay: number,
  numberOfDays: number
): DayCalendar => {
  if (indexInMonth < firstDay) {
    const previousMonth = month === January ? December : month - 1
    const previousYear = month === January ? year - 1 : year
    const previousMonthNumberOfDays = getNumberOfDays(previousYear, previousMonth)
    const dateOfMonth = previousMonthNumberOfDays + indexInMonth - firstDay + 1
    return {
      dateOfMonth,
      month: 'prev',
      timestamp: new Date(previousYear, previousMonth, dateOfMonth).getTime()
    }
  }
  const dateOfMonth = ((indexInMonth - firstDay) % numberOfDays) + 1
  if (indexInMonth - firstDay + 1 > numberOfDays) {
    const nextMonth = month === December ? January : month + 1
    const nextYear = month === December ? year + 1 : year
    return {
      dateOfMonth,
      month: 'next',
      timestamp: new Date(nextYear, nextMonth, dateOfMonth).getTime()
    }
  }
  return {
    dateOfMonth,
    month: 'curr',
    timestamp: new Date(year, month, dateOfMonth).getTime()
  }
}

export const getCalendarMonth = (year: Year, month: Month, weekStart: Day): MonthCalendar => {
  const weekStartIndex = DAYS.get(weekStart) ?? 0
  const firstDay = getMonthStart(year, month)
  const numberOfDays = getNumberOfDays(year, month)
  const monthCalendar: MonthCalendar = []

  WEEKS.forEach((week: number) => {
    const weekCalendar: WeekCalendar = []
    DAYS.forEach((dayIndex: number) => {
      weekCalendar.push(
        getCalendarDay(
          year,
          month,
          (week - (weekStartIndex <= firstDay ? 1 : 2)) * WEEK_DAYS_NUMBER +
            dayIndex +
            weekStartIndex,
          firstDay,
          numberOfDays
        )
      )
    })
    monthCalendar.push(weekCalendar)
  })

  return monthCalendar
}

export const getDays = (from: Day = 'sunday'): Day[] => {
  const fromIndex = DAYS.get(from) ?? 0
  const daysArray = Array.from(DAYS.keys())
  return daysArray.slice(fromIndex).concat(daysArray.slice(0, fromIndex))
}
