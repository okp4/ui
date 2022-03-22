import type { DeepReadonly } from './superTypes'

export function toImmutable<T>(o: T): DeepReadonly<T> {
  return o as DeepReadonly<T>
}
