import { gql } from '@urql/core'

export const SEND_TOKENS_SUBSCRIPTION = gql`
  subscription MSendTokens($input: SendInput!) {
    send(input: $input) {
      hash
    }
  }
`
