import type { Error } from 'domain/error/entity/error'
import type { EventMetadata } from 'eventBus/eventBus'
import type { Pair } from 'superTypes'

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
