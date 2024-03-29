import { gql } from '@urql/core'

export const SEND_TOKENS_SUBSCRIPTION = gql`
  subscription SSendTokens($input: SendInput!) {
    send(input: $input) {
      hash
      code
    }
  }
`
