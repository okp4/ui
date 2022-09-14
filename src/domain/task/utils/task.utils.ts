import type { DeepReadonly } from 'superTypes'

type Progress = { min?: number; max?: number; current?: number }

export const isProgressValid = (progress: DeepReadonly<Progress>): boolean => {
  const { max, min, current }: Progress = progress

  // force undefined explicit assertion to ensure that 0 and negative values are excluded
  if (current !== undefined) {
    if (min !== undefined && max !== undefined) return current <= max && current >= min && min < max
    if (min === undefined && max !== undefined) return current <= max
    if (max === undefined && min !== undefined) return current >= min
    return true
  }
  if (min !== undefined && max !== undefined) return min < max
  return true
}
