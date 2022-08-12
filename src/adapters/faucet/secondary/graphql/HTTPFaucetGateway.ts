import client from './client'
import {pipe, toPromise} from 'wonka';
import { SEND_TOKENS_SUBSCRIPTION } from './documents/sendTokens'
import type { MSendTokensSubscription, MSendTokensSubscriptionVariables } from './generated/types'
import { FaucetGatewayError, UnspecifiedError } from 'domain/faucet/entity/error'
import type { FaucetPort } from 'domain/faucet/port/faucetPort'

export class HTTPFaucetGateway implements FaucetPort {
  private readonly faucetUrl: string = ''

  constructor(faucetUrl: string) {
    this.faucetUrl = faucetUrl
  }

  public requestFunds = async (address: string): Promise<string> => {
      const result = await pipe(
          client(this.faucetUrl)
              .subscription<MSendTokensSubscription, MSendTokensSubscriptionVariables>(SEND_TOKENS_SUBSCRIPTION, {
                  input: {
                      toAddress: address
                  }
              }),
          toPromise
      )

    if (result.error) {
      throw new FaucetGatewayError(result.error.message)
    }

    if (!result.data) {
      throw new UnspecifiedError('Oooops... An unspecified error occured while requesting funds..')
    }

    return result.data.send.hash
  }
}
