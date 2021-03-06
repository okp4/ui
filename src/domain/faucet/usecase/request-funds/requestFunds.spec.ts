import short from 'short-uuid'
import { EventBus } from 'ts-bus'
import { ErrorBuilder } from 'domain/error/builder/error.builder'
import { InMemoryFaucetGateway } from 'adapters/faucet/secondary/graphql/InMemoryFaucetGateway'
import type { ReduxStore } from 'domain/faucet/store/store'
import { TaskBuilder } from 'domain/task/builder/task/task.builder'
import { EventParameter, getExpectedEventParameter } from 'domain/task/helper/test.helper'
import { requestFunds, faucetTaskType } from './requestFunds'
import { DeepReadonly } from 'superTypes'
import { UpdateTaskBuilder } from 'domain/task/builder/updateTask/updateTask.builder'
import { FaucetStoreBuilder } from 'domain/faucet/store/builder/store.builder'

interface InitialProps {
  store: ReduxStore
  faucetGateway: InMemoryFaucetGateway
}

interface Data {
  hasGatewayError: boolean
  address: string
  expectedEventParameters: EventParameter[]
}

const initiator = 'domain:faucet'
const fakedUuid = 'foobar'
const fakedDate = new Date(1992, 1, 1)
const eventBus = new EventBus()

jest.useFakeTimers('modern')
jest.setSystemTime(fakedDate)
short.generate = jest.fn(() => fakedUuid as short.SUUID)
const mockedEventBusPublish = jest.spyOn(eventBus, 'publish')

const task = new TaskBuilder()
  .withId(fakedUuid)
  .withCreationDate(fakedDate)
  .withLastUpdateDate(fakedDate)
  .withMessageKey('domain.task.proceeded')
  .withType(faucetTaskType)
  .build()

const updatedTask1 = new UpdateTaskBuilder()
  .withId(fakedUuid)
  .withLastUpdateDate(fakedDate)
  .withMessageKey('domain.task.error')
  .withStatus('error')
  .build()

const updatedTask2 = new UpdateTaskBuilder()
  .withId(fakedUuid)
  .withLastUpdateDate(fakedDate)
  .withMessageKey('domain.task.success')
  .withStatus('success')
  .build()

const bech32Error = new ErrorBuilder()
  .withId(fakedUuid)
  .withTimestamp(fakedDate)
  .withMessageKey('domain.error.bech32-error')
  .withType('bech32-error')
  .build()

const faucetGatewayError = new ErrorBuilder()
  .withId(fakedUuid)
  .withTimestamp(fakedDate)
  .withMessageKey('domain.error.faucet-gateway-error')
  .withType('faucet-gateway-error')
  .build()

const init = (): InitialProps => {
  const faucetGateway = new InMemoryFaucetGateway()
  const store = new FaucetStoreBuilder()
    .withEventBus(eventBus)
    .withDependencies({ faucetGateway })
    .build()
  return { store, faucetGateway }
}

/**
 * This is a hack to force error's payload context to be cleaned up in the publish first parameter when called with error event.
 * WHY? --> it's not possible to mock only the stack property of the error because the mock applies to the entire Error class
 */
const cleanErrorStack = (): void => {
  const foundErrorEvent = mockedEventBusPublish.mock.calls
    .flat()
    .find(elt => elt.type === 'error/errorThrown')
  if (foundErrorEvent?.payload?.context) {
    foundErrorEvent.payload.context = {}
  }
}

describe('Request funds from faucet', () => {
  afterAll(() => {
    jest.useRealTimers()
  })

  describe.each`
    hasGatewayError | address                                            | expectedEventParameters
    ${false}        | ${'123'}                                           | ${[getExpectedEventParameter('task/taskCreated', task, initiator, fakedDate), getExpectedEventParameter('error/errorThrown', bech32Error, initiator, fakedDate), getExpectedEventParameter('task/taskAmended', updatedTask1, initiator, fakedDate)]}
    ${false}        | ${'cosmos196877dj4crpxmja2ww2hj2vgy45v6uspm7nrmy'} | ${[getExpectedEventParameter('task/taskCreated', task, initiator, fakedDate), getExpectedEventParameter('error/errorThrown', bech32Error, initiator, fakedDate), getExpectedEventParameter('task/taskAmended', updatedTask1, initiator, fakedDate)]}
    ${true}         | ${'okp4196877dj4crpxmja2ww2hj2vgy45v6uspkzkt8l'}   | ${[getExpectedEventParameter('task/taskCreated', task, initiator, fakedDate), getExpectedEventParameter('error/errorThrown', faucetGatewayError, initiator, fakedDate), getExpectedEventParameter('task/taskAmended', updatedTask1, initiator, fakedDate)]}
    ${false}        | ${'okp4196877dj4crpxmja2ww2hj2vgy45v6uspkzkt8l'}   | ${[getExpectedEventParameter('task/taskCreated', task, initiator, fakedDate), getExpectedEventParameter('task/taskAmended', updatedTask2, initiator, fakedDate)]}
  `(
    'Given that address is <$address>',
    ({ hasGatewayError, address, expectedEventParameters }: Readonly<Data>): void => {
      const { store, faucetGateway }: InitialProps = init()
      hasGatewayError && faucetGateway.setError()
      describe('When requesting funds', () => {
        afterAll(() => {
          jest.clearAllMocks()
        })
        test('Then, expect events to be published', async () => {
          await store.dispatch(requestFunds(address))
          expectedEventParameters.forEach((elt: DeepReadonly<EventParameter>, index: number) => {
            const [first, second]: Readonly<EventParameter> = elt
            cleanErrorStack()
            expect(mockedEventBusPublish).toHaveBeenNthCalledWith(index + 1, first, second)
          })
        })
      })
    }
  )
})
