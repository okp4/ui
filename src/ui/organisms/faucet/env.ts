export const Env = {
  chainId: 'okp4-testnet-1',
  chainInfo: {
    chainId: 'okp4-testnet-1',
    chainName: 'OKP4',
    rpc: 'https://api.testnet.staging.okp4.network:443/rpc',
    rest: 'https://api.testnet.staging.okp4.network',
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: 'okp4',
      bech32PrefixAccPub: 'okp4' + 'pub',
      bech32PrefixValAddr: 'okp4' + 'valoper',
      bech32PrefixValPub: 'okp4' + 'valoperpub',
      bech32PrefixConsAddr: 'okp4' + 'valcons',
      bech32PrefixConsPub: 'okp4' + 'valconspub'
    },
    currencies: [
      {
        coinDenom: 'KNOW',
        coinMinimalDenom: 'know',
        coinDecimals: 6
      }
    ],
    feeCurrencies: [
      {
        coinDenom: 'KNOW',
        coinMinimalDenom: 'know',
        coinDecimals: 6
      }
    ],
    stakeCurrency: {
      coinDenom: 'KNOW',
      coinMinimalDenom: 'know',
      coinDecimals: 6
    },
    coinType: 118,
    gasPriceStep: {
      low: 0.01,
      average: 0.025,
      high: 0.03
    }
  }
}
