import {createClient, defaultExchanges, subscriptionExchange} from '@urql/core'
import type { Client, ExecutionResult } from '@urql/core'
import { createClient as createWSClient } from 'graphql-ws';
import type {ObserverLike, SubscriptionOperation} from "@urql/core/dist/types/exchanges/subscription";
import type {DeepReadonly} from "superTypes";

const urlReg = new RegExp("^(?<scheme>[a-z][a-z0-9+\\-.]*)://(?<target>.*)$")

export const makeWSURL = (rawURL: string): string => {
    const match = urlReg.exec(rawURL)
    const wsProtocol = (): string => {
        if (match?.groups?.scheme === "https") {
            return "wss"
        }
        return "ws"
    }
    
    return `${wsProtocol()}://${match?.groups?.target}`
}

const client = (url: string): Client => createClient({
    url,
    requestPolicy: 'network-only',
    exchanges: [
        ...defaultExchanges,
        subscriptionExchange({
            forwardSubscription: (operation: DeepReadonly<SubscriptionOperation>) => ({
                subscribe: (sink: DeepReadonly<ObserverLike<ExecutionResult>>) => ({
                    unsubscribe: createWSClient({
                        url: makeWSURL(url)
                    }).subscribe(operation, sink),
                }),
            }),
        }),
    ],
})

export default client
