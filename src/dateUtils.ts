import { Map } from 'immutable'

/**
 * The format of a date.
 */
export type DateFormat =
  | 'yyyy-mm-dd'
  | 'yyyy/mm/dd'
  | 'dd-mm-yyyy'
  | 'dd/mm/yyyy'
  | 'mm-dd-yyyy'
  | 'mm/dd/yyyy'

/**
 * The ISO date format by default.
 */
export const defaultDateFormat: DateFormat = 'yyyy-mm-dd'
/**
 * The regular expression corresponding to an ISO 8601 date.
 */
export const ISO_DATE_REGEX = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/
/**
 * The default regular expression corresponding to a date when it is being typed.
 */
export const defaultRegexTyping =
  /^\d{0,4}$|^\d{4}-[0-1]?$|^\d{4}-(?:0[1-9]|1[012])(?:-(?:[0-3]|0[1-9]?|[12]\d|3[01])?)?$/g
/**
 * The regular expressions corresponding to a date when it is being typed, by format.
 */
export const DateRegexTyping = Map<DateFormat, RegExp>([
  [defaultDateFormat, defaultRegexTyping],
  [
    'yyyy/mm/dd',
    /^\d{0,4}$|^\d{4}\/[0-1]?$|^\d{4}\/(?:0[1-9]|1[012])(?:\/(?:[0-3]|0[1-9]?|[12]\d|3[01])?)?$/g
  ],
  [
    'dd-mm-yyyy',
    /^[0-3]?$|^(?:0[1-9]|[12]\d|3[01])(?:-(?:(?:0$|0[1-9]|1[012]?)(?:-\d{0,4})?)?)?$/g
  ],
  [
    'dd/mm/yyyy',
    /^[0-3]?$|^(?:0[1-9]|[12]\d|3[01])(?:\/(?:(?:0$|0[1-9]|1[012]?)(?:\/\d{0,4})?)?)?$/g
  ],
  [
    'mm-dd-yyyy',
    /^[0-1]?$|^(?:0[1-9]|1[012]?)(?:-(?:(?:0$|[0-3]|0[1-9]|[12]\d|3[01])(?:-\d{0,4})?)?)?$/g
  ],
  [
    'mm/dd/yyyy',
    /^[0-1]?$|^(?:0[1-9]|1[012]?)(?:\/(?:(?:0$|[0-3]|0[1-9]|[12]\d|3[01])(?:\/\d{0,4})?)?)?$/g
  ]
])

/**
 * Check if the value is a date.
 *
 * @param value The value to check.
 * @returns `true` if the value is a date, `false` otherwise.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isDate = (value: any): value is Date => !isNaN(value) && value instanceof Date

/**
 * Check if a string is a valid ISO date or not.
 *
 * @param str The string to check.
 * @returns `true` if the string is a ISO date, `false` otherwise.
 */
export const isDateISO = (str: string): boolean => {
  if (!ISO_DATE_REGEX.test(str)) {
    return false
  }
  const date = new Date(str)
  return date instanceof Date && date.toISOString() === str
}

/**
 * Convert a string in a defined format to a `Date`.
 * @param str The string to convert.
 * @param format The format in which the string is.
 * @returns The date.
 */
export const stringToDate = (str: string, format: DateFormat = defaultDateFormat): Date | null => {
  const units = format.split(/\W/)
  const parts = str.split(/\D/)
  const date = new Date(
    +parts[units.indexOf('yyyy')],
    +parts[units.indexOf('mm')] - 1,
    +parts[units.indexOf('dd')]
  )
  return isDate(date) ? date : null
}

/**
 * Convert a ISO date to a string in the wanted format.
 * @param date The ISO string date.
 * @param format The format in which to convert the date.
 * @returns The string in the wanted format.
 */
export const dateToString = (date: string, format: DateFormat = defaultDateFormat): string => {
  if (isDateISO(date)) {
    const d = new Date(date)
    const year = `${d.getFullYear()}`
    const month = `${d.getMonth() + 1}`.padStart(2, '0')
    const day = `${d.getDate()}`.padStart(2, '0')
    return format.replace('yyyy', year).replace('mm', month).replace('dd', day)
  }
  return ''
}
