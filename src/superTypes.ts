/* eslint-disable @typescript-eslint/ban-types */
type Primitive = undefined | null | boolean | string | number | Function
type DeepReadonlyMap<K, V> = ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
type DeepReadonlyObject<T> = {
  readonly [K in keyof T]: DeepReadonly<T[K]>
}

export type DeepReadonly<T> = T extends Primitive
  ? T
  : T extends Map<infer K, infer V>
  ? DeepReadonlyMap<K, V>
  : T extends object
  ? DeepReadonlyObject<T>
  : unknown
