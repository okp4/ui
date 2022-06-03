export type FaucetPort = {
  readonly requestFunds: (address: string) => Promise<string>
}
