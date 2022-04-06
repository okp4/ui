import { GatewayError } from 'domain/faucet/entities/error'
import type { FaucetPort } from 'domain/faucet/ports/faucetPort'

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
