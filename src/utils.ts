import type { DeepReadonly } from './superTypes'
import type { Option } from './ui/molecules/select/Select'

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

export const sort = (value1: string, value2: string): number => value1.localeCompare(value2)

export const compareStrings = (value1: string, value2: string): number =>
  value1.localeCompare(value2)

const ascendingSortByGroupAndValues = (
  option1: Readonly<Option>,
  option2: Readonly<Option>
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

const descendingSortByGroupAndValues = (option1: Option, option2: Option): number => {
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

export const getOptionsAscendingSorted = (options: Readonly<Option[]>): Option[] => {
  return [...options].sort((option1: Option, option2: Option) =>
    ascendingSortByGroupAndValues(option1, option2)
  )
}

export const getOptionsDescendingSorted = (options: Readonly<Option[]>): Option[] => {
  return [...options].sort((option1: Option, option2: Option) =>
    descendingSortByGroupAndValues(option1, option2)
  )
}

export const capitalizeFirstLetter = (word: string): string => {
  return word.charAt(0).toLocaleUpperCase() + word.slice(1)
}

export const capitalizeFirstLetterOfEachArrayWord = (words: Readonly<string[]>): string[] => {
  return words.map((word: string) => capitalizeFirstLetter(word))
}
