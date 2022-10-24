import { createClient, defaultExchanges, subscriptionExchange } from '@urql/core'
import type { Client, ExecutionResult } from '@urql/core'
import type { Client as GQLWSClient } from 'graphql-ws'
import { createClient as createWSClient } from 'graphql-ws'
import type {
  ObserverLike,
  SubscriptionOperation
} from '@urql/core/dist/types/exchanges/subscription'
import type { DeepReadonly } from 'superTypes'
import { FaucetConnectionError } from 'domain/faucet/entity/error'

const urlReg = new RegExp('^(?<scheme>[a-z][a-z0-9+\\-.]*)://(?<target>.*)$')

export type FaucetClient = {
  gqlClient: Client
  unsuscribe: () => void
}

export const makeWSURL = (rawURL: string): string => {
  const match = urlReg.exec(rawURL)
  const wsProtocol = (): string => (match?.groups?.scheme === 'https' ? 'wss' : 'ws')
  return `${wsProtocol()}://${match?.groups?.target}`
}

const client = async (url: string): Promise<FaucetClient> => {
  return new Promise<GQLWSClient>(
    (
      resolve: (gqlWsClient: DeepReadonly<GQLWSClient>) => void,
      reject: (reason: DeepReadonly<FaucetConnectionError>) => void
    ) => {
      const wsClient = createWSClient({
        url: makeWSURL(url),
        lazy: false,
        on: {
          error: () => {
            wsClient.terminate()
            reject(new FaucetConnectionError('GQLWS client failed to connect'))
          },
          connected: () => {
            resolve(wsClient)
          }
        }
      })
    }
  ).then((gqlWsClient: DeepReadonly<GQLWSClient>) => ({
    gqlClient: createClient({
      url,
      requestPolicy: 'network-only',
      exchanges: [
        ...defaultExchanges,
        subscriptionExchange({
          forwardSubscription: (operation: DeepReadonly<SubscriptionOperation>) => ({
            subscribe: (sink: DeepReadonly<ObserverLike<ExecutionResult>>) => ({
              unsubscribe: gqlWsClient.subscribe(operation, sink)
            })
          })
        })
      ]
    }),
    unsuscribe: gqlWsClient.dispose
  }))
}

export default client
