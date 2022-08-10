export type Day = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'

export const DAYS: Day[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
]

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

export const getMonthStart = (year: number, month: number): number => new Date(year, month).getDay()

export const getNumberOfDays = (year: number, month: number): number =>
  42 - new Date(year, month, 42).getDate()

export type DayCalendar = {
  dateOfMonth: number
  month: number
  timestamp: number
}

export type WeekCalendar = DayCalendar[]

export type MonthCalendar = WeekCalendar[]

export const getDayCalendar = (
  year: number,
  month: number,
  indexInMonth: number,
  firstDay: number,
  numberOfDays: number
): DayCalendar => {
  if (indexInMonth < firstDay) {
    const previousMonth = month === 0 ? 11 : month - 1
    const previousYear = month === 0 ? year - 1 : year
    const previousMonthNumberOfDays = getNumberOfDays(previousYear, previousMonth)
    const dateOfMonth = previousMonthNumberOfDays + indexInMonth - firstDay + 1
    return {
      dateOfMonth,
      month: -1,
      timestamp: new Date(previousYear, previousMonth, dateOfMonth).getTime()
    }
  }
  const dateOfMonth = ((indexInMonth - firstDay) % numberOfDays) + 1
  if (indexInMonth - firstDay + 1 > numberOfDays) {
    const nextMonth = month === 11 ? 0 : month + 1
    const nextYear = month === 11 ? year + 1 : year
    return {
      dateOfMonth,
      month: +1,
      timestamp: new Date(nextYear, nextMonth, dateOfMonth).getTime()
    }
  }
  return {
    dateOfMonth,
    month: 0,
    timestamp: new Date(year, month, dateOfMonth).getTime()
  }
}

export const getMonthCalendar = (year: number, month: number, weekStart: Day): MonthCalendar => {
  const start = DAYS.indexOf(weekStart)
  const firstDay = getMonthStart(year, month)
  const numberOfDays = getNumberOfDays(year, month)
  const monthCalendar: MonthCalendar = []

  WEEKS.forEach((week: number) => {
    const weekCalendar: WeekCalendar = []
    DAYS.forEach((_day: string, index: number) => {
      weekCalendar.push(
        getDayCalendar(
          year,
          month,
          (week - (start <= firstDay ? 1 : 2)) * 7 + index + start,
          firstDay,
          numberOfDays
        )
      )
    })
    monthCalendar.push(weekCalendar)
  })

  return monthCalendar
}
