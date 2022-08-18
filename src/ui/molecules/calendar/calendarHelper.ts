import { OrderedMap } from 'immutable'

/**
 * All the days of the week.
 */
export type Day = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'
/**
 * The typed index of a month
 */
export type Month = number
export type DayCalendar = {
  /**
   * The date of the day in the month
   */
  dateOfMonth: number
  /**
   * Defines wheter the day belongs to the current month, the previous month or the next month.
   */
  month: 'prev' | 'curr' | 'next'
  /**
   * The ISO date of the day in the calendar.
   */
  dateISO: string
}
/**
 * A week represent a list of day
 */
export type WeekCalendar = DayCalendar[]
/**
 * A month represent a list of week
 */
export type MonthCalendar = WeekCalendar[]

/**
 * All the months of the year.
 */
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

/**
 * January, first month of the year
 */
export const January = 0
/**
 * December, last month of the year
 */
export const December = 11

const DAYS: OrderedMap<Day, number> = OrderedMap([
  ['sunday', 0],
  ['monday', 1],
  ['tuesday', 2],
  ['wednesday', 3],
  ['thursday', 4],
  ['friday', 5],
  ['saturday', 6]
])

const WEEK_DAYS_NUMBER = 7

const WEEKS = [1, 2, 3, 4, 5, 6]

const getMonthStart = (year: number, month: Month): number => new Date(year, month).getDay()

const getNumberOfDays = (year: number, month: Month): number =>
  42 - new Date(year, month, 42).getDate()

const getCalendarDay = (
  year: number,
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
      dateISO: new Date(previousYear, previousMonth, dateOfMonth).toISOString()
    }
  }
  const dateOfMonth = ((indexInMonth - firstDay) % numberOfDays) + 1
  if (indexInMonth - firstDay + 1 > numberOfDays) {
    const nextMonth = month === December ? January : month + 1
    const nextYear = month === December ? year + 1 : year
    return {
      dateOfMonth,
      month: 'next',
      dateISO: new Date(nextYear, nextMonth, dateOfMonth).toISOString()
    }
  }
  return {
    dateOfMonth,
    month: 'curr',
    dateISO: new Date(year, month, dateOfMonth).toISOString()
  }
}

/**
 * Build a month in a calendar format that contains all the days of the month
 * and the last week(s) of the previous month and/or the first week(s) of the next month.
 *
 * @param year The year of the wanted month.
 * @param month The wanted month.
 * @param weekStart The day with which the week begins in the calendar.
 * @returns The month of the calendar.
 */
export const getCalendarMonth = (year: number, month: Month, weekStart: Day): MonthCalendar => {
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

/**
 * Get the days of the week in the correct order dependinng on the first day
 *
 * @param from The first day of the week.
 * @returns The days of the week.
 */
export const getDays = (from: Day = 'sunday'): Day[] => {
  const fromIndex = DAYS.get(from) ?? 0
  const daysArray = Array.from(DAYS.keys())
  return daysArray.slice(fromIndex).concat(daysArray.slice(0, fromIndex))
}
