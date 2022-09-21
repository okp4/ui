import {
  ConnectionError,
  ChainSuggestionError,
  KeplrExtensionUnavailableError
} from 'domain/wallet/entities/errors'
import type { Wallet, WalletId } from 'domain/wallet/ports/walletPort'
import type { Accounts, ChainId } from 'domain/wallet/entities/wallet'
import { KeplrAccountMapper } from './mapper/account.mapper'
import type { Keplr } from '@keplr-wallet/types'
import { List as ImmutableList } from 'immutable'
import type { DeepReadonly } from 'superTypes'
import { asMutable } from 'utils'

export type Currency = {
  readonly coinDenom: string
  readonly coinMinimalDenom: string
  readonly coinDecimals: number
  readonly coinGeckoId?: string
  readonly coinImageUrl?: string
}
export type CW20Currency = Currency & {
  readonly type: 'cw20'
  readonly contractAddress: string
}
export type Secret20Currency = Currency & {
  readonly type: 'secret20'
  readonly contractAddress: string
  readonly viewingKey: string
}

export type IBCCurrency = Currency & {
  readonly paths: {
    portId: string
    channelId: string
  }[]
  readonly originChainId: string | undefined
  readonly originCurrency: Currency | CW20Currency | Secret20Currency | undefined
}

export type AppCurrency = Currency | CW20Currency | Secret20Currency | IBCCurrency

export type ChainInfo = {
  readonly rpc: string
  readonly rest: string
  readonly chainId: string
  readonly chainName: string
  readonly stakeCurrency: Currency
  readonly walletUrl?: string
  readonly walletUrlForStaking?: string
  readonly bip44: BIP44
  readonly alternativeBIP44s?: BIP44[]
  readonly bech32Config: Bech32Config
  readonly currencies: AppCurrency[]
  readonly feeCurrencies: Currency[]
  readonly coinType?: number
  readonly gasPriceStep?: {
    low: number
    average: number
    high: number
  }
  readonly features?: string[]
  readonly beta?: boolean
}

export type BIP44 = {
  readonly coinType: number
}

export type Bech32Config = {
  readonly bech32PrefixAccAddr: string
  readonly bech32PrefixAccPub: string
  readonly bech32PrefixValAddr: string
  readonly bech32PrefixValPub: string
  readonly bech32PrefixConsAddr: string
  readonly bech32PrefixConsPub: string
}

export class KeplrWalletGateway implements Wallet {
  private _isConnected: boolean = false
  private readonly chainInfos: DeepReadonly<Record<ChainId, ChainInfo>>

  constructor(chainInfos?: DeepReadonly<Array<ChainInfo>>) {
    this.chainInfos =
      chainInfos?.reduce(
        (acc: DeepReadonly<Record<ChainId, ChainInfo>>, chainInfo: DeepReadonly<ChainInfo>) => ({
          ...acc,
          [chainInfo.chainId]: chainInfo
        }),
        {}
      ) ?? {}
  }

  public readonly isAvailable = (): boolean => !!window.keplr && !!window.keplr.getOfflineSigner

  public readonly isConnected = (): boolean => this._isConnected

  public readonly connect = async (chainId: ChainId): Promise<void> => {
    if (!this.isAvailable()) {
      throw new KeplrExtensionUnavailableError(`Ooops... No Keplr extension available`)
    }

    return window.keplr
      ?.enable(chainId)
      .catch(async () =>
        this.suggestChain(chainId)
          .catch(() => {
            throw new ChainSuggestionError(
              `Ooops... Failed to suggest chain ${chainId} to Keplr extension, please check configuration`
            )
          })
          .then(() =>
            window.keplr?.enable(chainId).catch(() => {
              throw new ChainSuggestionError(
                `Ooops... Failed to enable chain ${chainId} to Keplr extension, please check configuration`
              )
            })
          )
      )
      .then(() => this.setConnected(true))
  }

  public readonly getAccounts = async (chainId: ChainId): Promise<Accounts> => {
    if (this.isConnected()) {
      const offlineSigner = (window.keplr as Keplr).getOfflineSigner(chainId)
      const accounts = await offlineSigner.getAccounts()
      return ImmutableList(accounts.map(KeplrAccountMapper.mapAccount))
    }
    throw new ConnectionError(
      "Oops ... Account can't be retrieved because extension is not connected..."
    )
  }

  public readonly id = (): WalletId => 'keplr'

  private readonly setConnected = (connected: boolean): void => {
    this._isConnected = connected
  }

  private readonly suggestChain = async (chainId: string): Promise<void> =>
    chainId in this.chainInfos && window.keplr
      ? window.keplr.experimentalSuggestChain(asMutable(this.chainInfos[chainId]))
      : Promise.reject(
          new ChainSuggestionError(`Ooops... Failed to suggest chain ${chainId} to Keplr extension`)
        )
}
