import { GatewayError } from 'domain/faucet/entity/error'
import type { FaucetPort } from 'domain/faucet/port/faucetPort'

export class InMemoryFaucetGateway implements FaucetPort {
  private error: GatewayError | null = null

  public askTokens = async (_address: string): Promise<void> => {
    if (this.error) {
      throw new GatewayError()
    }
    return Promise.resolve()
  }

  public setError = (): void => {
    this.error = new GatewayError()
  }
}
