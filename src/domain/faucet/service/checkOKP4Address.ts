import { decode } from 'bech32-buffer'
import type bech32 from 'bech32-buffer'
import { Bech32Error } from '../entity/error'

export const checkOKP4Address = (address: string): void => {
  try {
    const { prefix }: bech32.DecodeResult = decode(address)
    if (prefix !== 'okp4') {
      throw new Bech32Error('Address prefix does not begin with OKP4')
    }
  } catch (error: unknown) {
    throw new Bech32Error((error as Error).message)
  }
}
