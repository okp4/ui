import { FaucetGatewayError } from 'domain/faucet/entity/error'
import type { FaucetPort } from 'domain/faucet/port/faucetPort'

export class InMemoryFaucetGateway implements FaucetPort {
  private _error: FaucetGatewayError | null = null

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public requestFunds = async (_address: string): Promise<string> => {
    if (this._error) {
      throw new FaucetGatewayError()
    }
    return Promise.resolve('hash#1')
  }

  public setError = (): void => {
    this._error = new FaucetGatewayError()
  }
}
