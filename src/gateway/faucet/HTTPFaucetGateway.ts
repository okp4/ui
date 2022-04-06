import axios from 'axios'
import { GatewayError, UnspecifiedError } from 'domain/faucet/entities/error'
import type { FaucetPort } from 'domain/faucet/ports/faucetPort'

export class HTTPFaucetGateway implements FaucetPort {
  private readonly faucetUrl: string = ''

  constructor(faucetUrl: string) {
    this.faucetUrl = faucetUrl
  }

  public askTokens = async (address: string): Promise<void> => {
    await axios
      .get(this.faucetUrl, {
        params: {
          address
        }
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error)) {
          throw new GatewayError(error.message)
        } else {
          throw new UnspecifiedError('Oooops... An unspecified error occured while asking tokens..')
        }
      })
  }
}
