import type { DeepReadonly } from 'superTypes'

export type Entity<T, V> = {
  readonly id: V
} & DeepReadonly<T>
