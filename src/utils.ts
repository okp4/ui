import type { DeepReadonly } from './superTypes'

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

const ascendingSortByGroupAndValues = (
  option1: Readonly<SelectOption>,
  option2: Readonly<SelectOption>
): number => {
  const definedOption1 = option1.group ?? ''
  const definedOption2 = option2.group ?? ''

  if (definedOption1 > definedOption2) {
    return 1
  }

  if (definedOption1 < definedOption2) {
    return -1
  }

  return compareStrings(option1.value, option2.value)
}

const descendingSortByGroupAndValues = (option1: SelectOption, option2: SelectOption): number => {
  const definedOption1 = option1.group ?? ''
  const definedOption2 = option2.group ?? ''
  if (definedOption1 < definedOption2) {
    return 1
  }
  if (definedOption1 > definedOption2) {
    return -1
  }
  return option2.value.localeCompare(option1.value)
}

export const getOptionsAscendingSorted = (options: Readonly<SelectOption[]>): SelectOption[] => {
  return [...options].sort((option1: SelectOption, option2: SelectOption) =>
    ascendingSortByGroupAndValues(option1, option2)
  )
}

export const getOptionsDescendingSorted = (options: Readonly<SelectOption[]>): SelectOption[] => {
  return [...options].sort((option1: SelectOption, option2: SelectOption) =>
    descendingSortByGroupAndValues(option1, option2)
  )
}

export const capitalizeFirstLetter = (word: string): string => {
  return word.charAt(0).toLocaleUpperCase() + word.slice(1)
}

export const capitalizeFirstLetterOfEachArrayWord = (words: Readonly<string[]>): string[] => {
  return words.map((word: string) => capitalizeFirstLetter(word))
}
