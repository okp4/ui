/* eslint-disable @typescript-eslint/ban-types */
export type Primitive = undefined | null | boolean | string | number | Function
export type DeepReadonlyMap<K, V> = ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
export type DeepReadonlyObject<T> = {
  readonly [K in keyof T]: DeepReadonly<T[K]>
}
export type DeepReadonlyArray<T> = ReadonlyArray<DeepReadonly<T>>
export type DeepReadonlySet<T> = ReadonlySet<DeepReadonly<T>>

export type DeepReadonly<T> = T extends Primitive
  ? T
  : T extends Map<infer K, infer V>
  ? DeepReadonlyMap<K, V>
  : T extends object
  ? DeepReadonlyObject<T>
  : T extends Array<infer U>
  ? DeepReadonlyArray<U>
  : T extends Set<infer M>
  ? DeepReadonlySet<M>
  : unknown

export type JSONValue = string | number | boolean | { [x: string]: JSONValue } | Array<JSONValue>

export type Pair<U, V> = [U, V]

export type UseState<U> = [U, (value: U) => void]

export type UseReducerAction<U extends string, V> = { type: U; payload?: V }

export type UseReducer<T, U extends string, V> = [
  T,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  (action: DeepReadonly<UseReducerAction<U, V>>) => void
]

export type Callback<U, V> = (value: U) => V
