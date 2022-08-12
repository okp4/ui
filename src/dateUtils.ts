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
export const isDateValid = (value: any): value is Date => !isNaN(value) && value instanceof Date

export const stringToDate = (str: string, format: DateFormat = 'yyyy/mm/dd'): Date => {
  const units = format.split(/\W/)
  const parts = str.split(/\D/)
  const date = new Date(
    +parts[units.indexOf('yyyy')],
    +parts[units.indexOf('mm')] - 1,
    +parts[units.indexOf('dd')]
  )
  return isDateValid(date) ? date : new Date()
}

export const dateToString = (
  date: DeepReadonly<Date>,
  format: DateFormat = 'yyyy/mm/dd'
): string => {
  const d = new Date(date)
  const year = `${d.getFullYear()}`
  const month = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return format.replace('yyyy', year).replace('mm', month).replace('dd', day)
}
