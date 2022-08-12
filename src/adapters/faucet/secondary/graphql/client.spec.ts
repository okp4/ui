import { makeWSURL } from './client'

describe.each`
  desc                                  | url                                             | expected_ws_url
  ${"an url with unknown protocol"}     | ${"wtf://w.tf/graphql"}                         | ${"ws://w.tf/graphql"}
  ${"a classic http url"}               | ${"http://faucet.testnet.okp4.network/graphql"} | ${"ws://faucet.testnet.okp4.network/graphql"}
  ${"an http url with a specific port"} | ${"http://localhost:8080/graphql"}              | ${"ws://localhost:8080/graphql"}
  ${"an https url"}                     | ${"https://give.me.tokens/free/graphql"}        | ${"wss://give.me.tokens/free/graphql"}
`(
  `Given <$desc>.`,
  ({desc, url, expected_ws_url}) => {
    describe("When mapping to a websocket url.", () => {
      const result = makeWSURL(url)

      test("Then the returned url shall be properly mapped.", () => {
        expect(result).toBe(expected_ws_url)
      })
    })
  }
)
