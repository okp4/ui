import type { DeepReadonly, SizeUnit } from './superTypes'

export const asImmutable = <T>(o?: T): DeepReadonly<T> => o as DeepReadonly<T>

export const asMutable = <T, U extends DeepReadonly<T>>(o?: U): T => o as T

export type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T
export const truthy = <T>(value: T): value is Truthy<T> => Boolean(value)

export const toPercent = (value: number, min: number, max: number): number => {
  if (min > max) {
    return 0
  }
  const totalScale = max - min
  const valueInScale = value - min
  if (value > max) {
    return 100
  }
  if (value < min) {
    return 0
  }
  return totalScale ? (100 * valueInScale) / totalScale : 0
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isString = (value: any): value is string => typeof value === 'string'

export const compareStrings = (
  referenceStr: string,
  compareString: string,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  locales?: string | string[],
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  options?: Intl.CollatorOptions | undefined
): number => referenceStr.localeCompare(compareString, locales, options)

export type SelectOption = {
  readonly label: string
  readonly value: string
  readonly group?: string
}

const selectOptionAscComparator = (
  option1: Readonly<SelectOption>,
  option2: Readonly<SelectOption>
): number => {
  const groupComparison = compareStrings(option1.group ?? '', option2.group ?? '')

  if (groupComparison !== 0) {
    return groupComparison
  }

  return compareStrings(option1.value, option2.value)
}

const selectOptionDescComparator = (option1: SelectOption, option2: SelectOption): number =>
  -1 * selectOptionAscComparator(option1, option2)

export const sortSelectOptionAsc = (options: Readonly<SelectOption[]>): SelectOption[] =>
  [...options].sort(selectOptionAscComparator)

export const sortSelectOptionDesc = (options: Readonly<SelectOption[]>): SelectOption[] =>
  [...options].sort(selectOptionDescComparator)

export const convertSize = (size: number): { value: string; unit: SizeUnit } => {
  const tb = Math.pow(10, 12)
  const gb = Math.pow(10, 9)
  const mb = Math.pow(10, 6)
  const kb = Math.pow(10, 3)

  if (size > tb) {
    return { value: (size / tb).toFixed(2), unit: 'TB' }
  }
  if (size > gb) {
    return { value: (size / gb).toFixed(2), unit: 'GB' }
  }
  if (size > mb) {
    return { value: (size / mb).toFixed(2), unit: 'MB' }
  }
  if (size > kb) {
    return { value: (size / kb).toFixed(2), unit: 'KB' }
  }
  return { value: size.toFixed(2), unit: 'B' }
}
