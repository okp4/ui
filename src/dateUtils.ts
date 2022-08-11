import type { DeepReadonly } from 'superTypes'
import { Map } from 'immutable'

export type DateFormat =
  | 'yyyy/mm/dd'
  | 'yyyy-mm-dd'
  | 'dd/mm/yyyy'
  | 'dd-mm-yyyy'
  | 'mm/dd/yyyy'
  | 'mm-dd-yyyy'

export const DateLength = 10

export const defaultRegexTyping =
  /^\d{0,4}$|^\d{4}\/[0-1]?$|^\d{4}\/(?:0[1-9]|1[012])(?:\/(?:[0-3]|0[1-9]?|[12]\d|3[01])?)?$/g

export const DateRegexTyping = Map<DateFormat, RegExp>([
  ['yyyy/mm/dd', defaultRegexTyping],
  [
    'yyyy-mm-dd',
    /^\d{0,4}$|^\d{4}-[0-1]?$|^\d{4}-(?:0[1-9]|1[012])(?:-(?:[0-3]|0[1-9]?|[12]\d|3[01])?)?$/g
  ],
  [
    'dd/mm/yyyy',
    /^[0-3]?$|^(?:0[1-9]|[12]\d|3[01])(?:\/(?:(?:0$|0[1-9]|1[012]?)(?:\/\d{0,4})?)?)?$/g
  ],
  [
    'dd-mm-yyyy',
    /^[0-3]?$|^(?:0[1-9]|[12]\d|3[01])(?:-(?:(?:0$|0[1-9]|1[012]?)(?:-\d{0,4})?)?)?$/g
  ],
  [
    'mm/dd/yyyy',
    /^[0-1]?$|^(?:0[1-9]|1[012]?)(?:\/(?:(?:0$|[0-3]|0[1-9]|[12]\d|3[01])(?:\/\d{0,4})?)?)?$/g
  ],
  [
    'mm-dd-yyyy',
    /^[0-1]?$|^(?:0[1-9]|1[012]?)(?:-(?:(?:0$|[0-3]|0[1-9]|[12]\d|3[01])(?:-\d{0,4})?)?)?$/g
  ]
])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isValidDate = (value: any): value is Date => !isNaN(value) && value instanceof Date

export const stringToDate = (str: string, format: DateFormat = 'yyyy/mm/dd'): Date => {
  const parts = str.replaceAll('-', '/').split('/')
  const values = {
    year: '',
    month: '',
    day: ''
  }
  switch (format) {
    case 'yyyy/mm/dd':
      values.year = parts[0]
      values.month = parts[1]
      values.day = parts[2]
      break
    case 'dd/mm/yyyy':
      values.year = parts[2]
      values.month = parts[1]
      values.day = parts[0]
      break
    case 'mm/dd/yyyy':
      values.year = parts[2]
      values.month = parts[0]
      values.day = parts[1]
      break
    default:
      values.year = parts[0]
      values.month = parts[1]
      values.day = parts[2]
      break
  }
  const date = new Date(+values.year, +values.month - 1, +values.day)
  return isValidDate(date) ? date : new Date()
}

export const dateToString = (
  date: DeepReadonly<Date>,
  format: DateFormat = 'yyyy/mm/dd'
): string => {
  const d = new Date(date)
  const year = `${d.getFullYear()}`
  const month = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')

  const map = Map([
    ['yyyy', year],
    ['mm', month],
    ['dd', day]
  ])

  const separator = format.indexOf('/') > -1 ? '/' : '-'
  const parts = format.replaceAll('-', '/').split('/')
  return [map.get(parts[0]), map.get(parts[1]), map.get(parts[2])].join(separator)
}
