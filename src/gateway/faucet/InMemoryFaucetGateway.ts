import { GatewayError } from 'domain/faucet/entity/error'
import type { FaucetPort } from 'domain/faucet/port/faucetPort'

export class InMemoryFaucetGateway implements FaucetPort {
  private _error: GatewayError | null = null

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public askTokens = async (_address: string): Promise<void> => {
    if (this._error) {
      throw new GatewayError()
    }
    return Promise.resolve()
  }

  public setError = (): void => {
    this._error = new GatewayError()
  }
}
