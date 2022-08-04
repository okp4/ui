export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const MONTH = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const getMonthStart = (year: number, month: number): number => new Date(year, month).getDay()

export const getNumberOfDays = (year: number, month: number): number =>
  42 - new Date(year, month, 42).getDate()

export const getTodayTimestamp = (): number =>
  Date.now() - (Date.now() % (60 * 60 * 24 * 1000)) + new Date().getTimezoneOffset() * 1000 * 60

export const test = (): any => new Date(2022, 8, -10)
