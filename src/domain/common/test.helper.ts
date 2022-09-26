/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
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

/**
 * This is a hack to force error's payload context to be cleaned up in the publish first parameter when called with error event.
 * WHY? --> it's not possible to mock only the stack property of the error because the mock applies to the entire Error class
 */
export const cleanErrorStack = (mockedEventBusPublish: jest.SpyInstance): void => {
  const foundErrorEvent = mockedEventBusPublish.mock.calls
    .flat()
    // eslint-disable-next-line @typescript-eslint/typedef
    .find(elt => elt.type === 'error/errorThrown')
  if (foundErrorEvent?.payload?.context) {
    foundErrorEvent.payload.context = {}
  }
}
