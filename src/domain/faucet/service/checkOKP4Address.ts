import { decode } from 'bech32-buffer'
import type bech32 from 'bech32-buffer'
import { ValidationError } from '../entity/error'

export const checkOKP4Address = (address: string): void => {
  try {
    const { prefix }: bech32.DecodeResult = decode(address)
    if (prefix !== 'okp4') {
      throw new ValidationError('Address prefix does not begin with OKP4')
    }
  } catch (error: unknown) {
    throw new ValidationError((error as Error).message)
  }
}
