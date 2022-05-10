import { EventBus } from 'ts-bus'
import type { BusEvent } from 'ts-bus/types'

export type EventMetadata = {
  timestamp: Date
  initiator: string
}

export type TypedBusEvent<T> = Omit<Omit<BusEvent, 'payload'>, 'meta'> & { meta: EventMetadata } & T

export const eventBus = new EventBus()
