import axios from 'axios'
import type { AxiosError } from 'axios'
import { GatewayError, UnspecifiedError } from 'domain/wallet/entities/errors'
import { HTTPFaucetGateway } from './HTTPFaucetGateway'

const mockedAxiosGet = jest.spyOn(axios, 'get')
const testUrl = 'http://my-test-fake-url.com'

afterEach(() => {
  jest.clearAllMocks()
})

describe('Given an HTTPFaucetGateway instance', () => {
  const gateway = new HTTPFaucetGateway(testUrl)

  describe('And an axios client returning a success value', () => {
    mockedAxiosGet.mockResolvedValueOnce(undefined)

    describe('When requesting funds', () => {
      test('Then expect the call to succeed', async () => {
        const result = await gateway.requestFunds(testUrl)
        expect(mockedAxiosGet).toHaveBeenCalledWith(testUrl, {
          params: {
            address: testUrl
          }
        })
        expect(result).toEqual(undefined)
        expect(mockedAxiosGet).toHaveBeenCalledTimes(1)
      })
    })
  })
})

describe('Given an HTTPFaucetGateway instance', () => {
  const gateway = new HTTPFaucetGateway(testUrl)

  describe('And an axios client returning an Axios error', () => {
    const error = new Error('Network Error') as AxiosError
    error.isAxiosError = true
    mockedAxiosGet.mockRejectedValueOnce(error)

    describe('When requesting funds', () => {
      test('Then expect the call to throw a GatewayError', async () => {
        const result = gateway.requestFunds(testUrl)

        const gatewayError = new GatewayError('Network Error')
        await expect(result).rejects.toEqual(gatewayError)
        await expect(result).rejects.toThrow(gatewayError)
        expect(mockedAxiosGet).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('And an axios client returns a non Axios error', () => {
    const error = new Error()
    mockedAxiosGet.mockRejectedValueOnce(error)

    describe('When requesting funds', () => {
      test('Then expect the call to throw a UnspecifiedError', async () => {
        const unspecifiedError = new UnspecifiedError(
          'Oooops... An unspecified error occured while requesting funds..'
        )
        const result = gateway.requestFunds(testUrl)
        expect(result).rejects.toEqual(unspecifiedError)
        expect(result).rejects.toThrow(unspecifiedError)
        expect(mockedAxiosGet).toHaveBeenCalledTimes(1)
      })
    })
  })
})
