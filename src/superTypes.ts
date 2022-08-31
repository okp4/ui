import type { Dispatch, Reducer, ReducerAction, ReducerState } from 'react'

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

export type UseReducer<S, A> = [ReducerState<Reducer<S, A>>, Dispatch<ReducerAction<Reducer<S, A>>>]

export type Callback<U, V> = (value: U) => V

export type SizeUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB'
export type ReadableSize = { value: string; unit: SizeUnit }
