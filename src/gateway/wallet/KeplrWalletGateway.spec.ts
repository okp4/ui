/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { ConnectionError } from 'domain/wallet/entities/errors'
import { KeplrWallet } from './KeplrWalletGateway'
import type { OfflineSigner } from '@cosmjs/launchpad'
import type { OfflineDirectSigner } from '@cosmjs/proto-signing'
import type { ChainInfo, Keplr } from '@keplr-wallet/types'

const offlineSignerFaked = (): ((_chainId: string) => OfflineSigner & OfflineDirectSigner) =>
  jest.fn(
    (_chainId: string): OfflineSigner & OfflineDirectSigner =>
      ({} as OfflineSigner & OfflineDirectSigner)
  )
  
describe('Given that no Keplr extension is installed', () => {
  const keplr = undefined

  describe('Given a Keplr gateway instance', () => {
    const wallet = new KeplrWallet()

    describe('When connecting to a chain', () => {
      test('Then expect the Keplr gateway to report an error', async () => {
        window.keplr = keplr
        const result = wallet.connect('test')

        expect(result).rejects.toStrictEqual(
          new ConnectionError(`Ooops... No Keplr extension available`)
        )
      })
    })
  })
})

describe(`Given a Keplr extension so that:
- it connects successfully to any chain`, () => {
  const chainId = 'my-chain'
  const getOfflineSigner = offlineSignerFaked()
  const keplr = {
    getOfflineSigner: getOfflineSigner,
    enable: async (_chainId: string): Promise<void> => Promise.resolve()
  } as Keplr

  describe('Given a Keplr gateway instance', () => {
    const wallet = new KeplrWallet()

    describe('When checking for availability', () => {
      test('Then result returned is <true>', () => {
        window.keplr = keplr
        const result = wallet.isAvailable()

        expect(result).toBe(true)
      })
    })

    describe('When connecting to a chain', () => {
      test('Then expect the connection to succeed', async () => {
        window.keplr = keplr
        const result = await wallet.connect(chainId)

        expect(wallet.isConnected()).toBe(true)
      })
    })
  })
})

describe(`Given a Keplr extension so that:
- it refuses to connect to a chain
- but accepts chain suggestion
- and then accepts to connect to the chain`, () => {
  const chainId = 'my-chain'
  const keplr = {
    getOfflineSigner: offlineSignerFaked(),
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    experimentalSuggestChain: async (chainInfo: ChainInfo): Promise<void> => Promise.resolve(),
    enable: jest
      .fn(async (_chainId: string): Promise<void> => undefined)
      .mockRejectedValueOnce(new Error(`There is no chain info for ${chainId}`))
      .mockResolvedValueOnce() as (chainId: string) => Promise<void>
  } as Keplr
  const chainInfo = {
    chainId: chainId
  } as ChainInfo

  describe('Given a Keplr gateway instance', () => {
    const wallet = new KeplrWallet([chainInfo])

    describe('When connecting to a chain', () => {
      test('Then expect the Keplr gateway to succeed', async () => {
        window.keplr = keplr
        const result = await wallet.connect(chainId)

        expect(keplr.enable).toBeCalledTimes(2)
        expect(wallet.isConnected()).toBe(true)
      })
    })
  })
})

describe(`Given a Keplr extension so that:
- it refuses to connect to a chain
- and refuses chain suggestion`, () => {
  const chainId = 'my-chain'
  const keplr = {
    getOfflineSigner: offlineSignerFaked(),
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    experimentalSuggestChain: async (chainInfo: ChainInfo): Promise<void> => Promise.resolve(),
    enable: jest
      .fn(async (_chainId: string): Promise<void> => undefined)
      .mockRejectedValueOnce(new Error(`There is no chain info for ${chainId}`))
      .mockResolvedValueOnce() as (chainId: string) => Promise<void>
  } as Keplr
  const chainInfo = {
    chainId: 'foo-' + chainId
  } as ChainInfo

  describe('Given a Keplr gateway instance', () => {
    const wallet = new KeplrWallet([chainInfo])

    describe('When connecting to a chain', () => {
      test('Then expect the Keplr gateway to fail', async () => {
        window.keplr = keplr
        const result = wallet.connect(chainId)

        await expect(result).rejects.toStrictEqual(
          new ConnectionError(
            `Ooops... Failed to suggest chain ${chainId} to Keplr extension, please check configuration`
          )
        )
        expect(keplr.enable).toBeCalledTimes(1)
        expect(wallet.isConnected()).toBe(false)
      })
    })
  })
})

describe(`Given a Keplr extension so that:
- it refuses to connect to a chain
- but accepts chain suggestion
- but still refues to connect to the chain`, () => {
  const chainId = 'my-chain'
  const keplr = {
    getOfflineSigner: offlineSignerFaked(),
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    experimentalSuggestChain: async (chainInfo: ChainInfo): Promise<void> => Promise.resolve(),
    enable: jest
      .fn(async (_chainId: string): Promise<void> => undefined)
      .mockRejectedValue(new Error(`There is no chain info for ${chainId}`)) as (
      chainId: string
    ) => Promise<void>
  } as Keplr
  const chainInfo = {
    chainId: chainId
  } as ChainInfo

  describe('Given a Keplr gateway instance', () => {
    const wallet = new KeplrWallet([chainInfo])

    describe('When connecting to a chain', () => {
      test('Then expect the Keplr gateway to fail', async () => {
        window.keplr = keplr
        const result = wallet.connect(chainId)

        await expect(result).rejects.toStrictEqual(
          new ConnectionError(
            `Ooops... Failed to enable chain ${chainId} to Keplr extension, please check configuration`
          )
        )
        expect(keplr.enable).toBeCalledTimes(2)
        expect(wallet.isConnected()).toBe(false)
      })
    })
  })
})
