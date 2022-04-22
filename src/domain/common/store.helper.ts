import type { Action, Middleware, Dispatch, AnyAction } from 'redux'
import type { DeepReadonly } from 'superTypes'
import type { EventBus } from 'ts-bus'

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

export function eventBusMiddleware(eventBus: DeepReadonly<EventBus>): Middleware {
  return function () {
    return function (next: Dispatch<AnyAction>) {
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      return function (action: DeepReadonly<Action<string> | ActionWithPayload<string, unknown>>) {
        const payload = (action as ActionWithPayload<string, unknown>).payload || null
        const event = { type: action.type, payload: payload }
        eventBus.publish(event)
        return next(action)
      }
    }
  }
}
