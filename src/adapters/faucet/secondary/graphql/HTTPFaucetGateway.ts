import type { OperationResult } from '@urql/core'
import { pipe, toPromise } from 'wonka'
import type { FaucetClient } from './client'
import client from './client'
import { SEND_TOKENS_SUBSCRIPTION } from './documents/sendTokens'
import type { SSendTokensSubscription, SSendTokensSubscriptionVariables } from './generated/types'
import { FaucetGatewayError, UnspecifiedError } from 'domain/faucet/entity/error'
import type { FaucetPort } from 'domain/faucet/port/faucetPort'

export class HTTPFaucetGateway implements FaucetPort {
  private readonly faucetUrl: string = ''

  constructor(faucetUrl: string) {
    this.faucetUrl = faucetUrl
  }

  public requestFunds = async (address: string): Promise<string> => {
    return (
      client(this.faucetUrl)
        // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
        .then(async ({ gqlClient, unsuscribe }: FaucetClient) =>
          pipe(
            gqlClient.subscription<SSendTokensSubscription, SSendTokensSubscriptionVariables>(
              SEND_TOKENS_SUBSCRIPTION,
              {
                input: {
                  toAddress: address
                }
              }
            ),
            toPromise
          )
            // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
            .then(({ data, error }: OperationResult<SSendTokensSubscription>) => {
              if (error) {
                throw new FaucetGatewayError(error.message)
              }

              if (!data || data.send.code !== 0) {
                throw new UnspecifiedError(
                  'Oooops... An unspecified error occured while requesting funds..'
                )
              }
              return data.send.hash
            })
            .catch(() => {
              throw new UnspecifiedError(
                'Oooops... An unspecified error occured while requesting funds..'
              )
            })
            .finally(() => {
              unsuscribe()
            })
        )
    )
  }
}
