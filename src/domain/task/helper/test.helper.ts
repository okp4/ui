import type { Error } from 'domain/error/entity/error'
import type { EventMetadata } from 'eventBus/eventBus'
import type { Pair } from 'superTypes'
import type { Task, UpdateTask } from '../entity/task'

export type EventParameter = Pair<
  { type: string; payload: Error | Task | UpdateTask },
  EventMetadata
>
type Payload = Error | Task | UpdateTask

export const getExpectedEventParameter = (
  type: string,
  payload: Payload,
  initiator: string
): EventParameter => {
  return [
    { ...{ type }, ...{ payload } },
    { initiator, timestamp: new Date() }
  ]
}
