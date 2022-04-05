import type { Action } from 'redux'

export interface ActionWithPayload<T extends string, P> extends Action<T> {
  readonly payload: P
}

export function createAction<T extends string>(type: T): Action<T>
export function createAction<T extends string, P>(type: T, payload?: P): ActionWithPayload<T, P>

export function createAction<T extends string, P>(
  type: T,
  payload?: P
): Action<T> | ActionWithPayload<T, P> {
  return payload === undefined ? { type } : { type, payload }
}

type FunctionType = (...args: readonly never[]) => unknown
type ActionCreatorsMapObject = Record<string, FunctionType>

export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<A[keyof A]>
