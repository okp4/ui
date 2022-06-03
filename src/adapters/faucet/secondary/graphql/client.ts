import { createClient } from '@urql/core'
import type { Client } from '@urql/core'

const client = (url: string): Client => createClient({ url, requestPolicy: 'network-only' })

export default client
