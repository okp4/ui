import { List } from 'immutable'
import { EventBus } from 'ts-bus'
import type { BusEvent } from 'ts-bus/types'
import type { ReduxStore } from 'domain/faucet/store/store'
import type { AppState } from 'domain/faucet/store/appState'
import type { EventMetadata } from 'eventBus/eventBus'
import { FaucetStoreBuilder } from 'domain/faucet/store/builder/store.builder'
import type { DeepReadonly } from 'superTypes'
import { InMemoryFaucetGateway } from '../secondary/graphql/InMemoryFaucetGateway'
import { AccountBuilder } from 'domain/wallet/builders/account.builder'

type InitialProps = Readonly<{
  store: ReduxStore
  eventBus: EventBus
}>

type Data = DeepReadonly<{
  event: BusEvent | undefined
  dispatched: boolean
}>

const address = 'okp4196877dj4crpxmja2ww2hj2vgy45v6uspkzkt8l'
const chainId = 'chain#1'
const accounts = List([
  new AccountBuilder().withAddress(address).withPublicKey(new Uint8Array(2)).build()
])
const meta: EventMetadata = { initiator: 'domain:test', timestamp: new Date() }

const init = (): InitialProps => {
  const eventBus = new EventBus()
  const faucetGateway = new InMemoryFaucetGateway()
  const store = new FaucetStoreBuilder()
    .withEventBus(eventBus)
    .withDependencies({ faucetGateway })
    .build()
  return { store, eventBus }
}

describe.each`
  event                                                                   | dispatched
  ${undefined}                                                            | ${false}
  ${{ type: 'task/fooBar', payload: { chainId, accounts } }}              | ${false}
  ${{ type: 'wallet/accountsRetrieved', payload: { chainId, accounts } }} | ${true}
`('Given that event is <$event>', ({ event, dispatched }: Data): void => {
  const { store, eventBus }: InitialProps = init()
  const mockedStoreDispatch = jest.spyOn(store, 'dispatch')

  describe(`When publishing ${!event ? 'no' : `a ${event.type}`} event`, () => {
    event && eventBus.publish(event, meta)

    test(`Then, expect Faucet event listeners to ${
      !dispatched ? 'not' : ''
    } call store dispatch`, () => {
      if (dispatched) {
        expect(mockedStoreDispatch).toHaveBeenCalled()
      } else {
        expect(mockedStoreDispatch).not.toHaveBeenCalled()
      }
    })
  })
})
