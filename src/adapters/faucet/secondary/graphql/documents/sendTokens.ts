import { gql } from '@urql/core'

export const SEND_TOKENS_MUTATION = gql`
  mutation MSendTokens($input: SendInput!) {
    send(input: $input) {
      hash
    }
  }
`
