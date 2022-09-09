/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { OrderedSet } from 'immutable'
import type { Error } from 'domain/error/entity/error'
import type { EventMetadata } from 'eventBus/eventBus'
import type { DeepReadonly, Pair } from 'superTypes'
import type { Task } from '../entity/task'
import type { AppState } from '../store/appState'

export type EventParameter<T> = Pair<{ type: string; payload: Payload<T> }, EventMetadata>
type Payload<T> = Error | T

export const getExpectedEventParameter = <T>(
  type: string,
  payload: Payload<T>,
  initiator: string,
  date: Readonly<Date>
): EventParameter<T> => {
  return [
    { ...{ type }, ...{ payload } },
    { initiator, timestamp: date }
  ]
}

// Compute state after invoking removeTask* commands
export const getExpectedStateAfterRemove = (
  initialState: DeepReadonly<AppState>,
  tasks: DeepReadonly<Task[]>,
  errorIndex?: number
): AppState =>
  tasks.reduce<AppState>((acc: DeepReadonly<AppState>, cur: Task, index: number): AppState => {
    const foundTask = acc.task.byId.get(cur.id)
    return index !== errorIndex
      ? {
          task: {
            byId: foundTask ? acc.task.byId.remove(cur.id) : acc.task.byId,
            byType: acc.task.byType
              .map((value: Readonly<OrderedSet<string>>) => value.delete(cur.id))
              .filter((value: Readonly<OrderedSet<string>>) => !value.isEmpty())
          },
          displayedTaskIds: acc.displayedTaskIds.remove(cur.id)
        }
      : acc
  }, initialState)

export const expectEventParameters = <T>(
  expectedEventParameters: EventParameter<T>[],
  mockedEventBusPublish: jest.SpyInstance
): void => {
  if (expectedEventParameters.length) {
    expectedEventParameters.forEach((elt: EventParameter<T>, index: number) => {
      const [first, second]: EventParameter<T> = elt
      expect(mockedEventBusPublish).toHaveBeenNthCalledWith(index + 1, first, second)
    })
  }
}

export const getExpectedStateAfterAmend = (
  iniialState: DeepReadonly<AppState>,
  tasks: DeepReadonly<Task[]>,
  errorIndex?: number
): AppState =>
  tasks.reduce<AppState>((acc: DeepReadonly<AppState>, cur: Task, index: number): AppState => {
    const foundTask = acc.task.byId.get(cur.id)
    return index !== errorIndex
      ? {
          task: {
            byId: foundTask ? acc.task.byId.set(cur.id, { ...foundTask, ...cur }) : acc.task.byId,
            byType: acc.task.byType
          },
          displayedTaskIds: acc.displayedTaskIds.add(cur.id)
        }
      : acc
  }, iniialState)
