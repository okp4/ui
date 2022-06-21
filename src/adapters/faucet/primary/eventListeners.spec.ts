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
  expectedState: AppState
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
  event                                                                   | expectedState
  ${undefined}                                                            | ${{ address: '' }}
  ${{ type: 'task/fooBar', payload: { chainId, accounts } }}              | ${{ address: '' }}
  ${{ type: 'wallet/accountsRetrieved', payload: { chainId, accounts } }} | ${{ address }}
`('Given that event is <$event>', ({ event, expectedState }: Data): void => {
  const { store, eventBus }: InitialProps = init()

  describe(`When publishing ${!event ? 'no' : `a ${event.type}`} event`, () => {
    event && eventBus.publish(event, meta)

    test(`Then, expect state to be ${expectedState}`, () => {
      expect(store.getState()).toEqual(expectedState)
    })
  })
})
