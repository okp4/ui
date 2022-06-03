import client from './client'
import * as SEND_TOKENS_MUTATION from './documents/sendTokens.graphql'
import type { MSendTokensMutation, MSendTokensMutationVariables } from './generated/types'
import { GatewayError, UnspecifiedError } from 'domain/faucet/entity/error'
import type { FaucetPort } from 'domain/faucet/port/faucetPort'

export class HTTPFaucetGateway implements FaucetPort {
  private readonly faucetUrl: string = ''

  constructor(faucetUrl: string) {
    this.faucetUrl = faucetUrl
  }

  public requestFunds = async (address: string): Promise<string> => {
    const result = await client(this.faucetUrl)
      .mutation<MSendTokensMutation, MSendTokensMutationVariables>(SEND_TOKENS_MUTATION, {
        input: {
          toAddress: address
        }
      })
      .toPromise()

    if (result.error) {
      throw new GatewayError(result.error.message)
    }

    if (!result.data) {
      throw new UnspecifiedError('Oooops... An unspecified error occured while requesting funds..')
    }

    return result.data.send.hash
  }
}
