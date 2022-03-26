import type { DeepReadonly } from './superTypes'

export const toImmutable = <T>(o?: T): DeepReadonly<T> => o as DeepReadonly<T>
