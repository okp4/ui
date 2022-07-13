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

export const compareStrings = (value1: string, value2: string): number =>
  value1.localeCompare(value2)
