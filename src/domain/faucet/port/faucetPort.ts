export type FaucetPort = {
  readonly askTokens: (address: string) => Promise<void>
}
