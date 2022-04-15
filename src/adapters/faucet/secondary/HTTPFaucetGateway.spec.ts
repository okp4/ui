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
  describe('When Axios returns a response ', () => {
    mockedAxiosGet.mockResolvedValueOnce(testUrl)
    test('Then expect requestFunds to succeed', async () => {
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

describe('Given an HTTPFaucetGateway instance', () => {
  const gateway = new HTTPFaucetGateway(testUrl)
  describe('When Axios fails with an AxiosError ', () => {
    const error = new Error('Network Error') as AxiosError
    error.isAxiosError = true
    mockedAxiosGet.mockRejectedValueOnce(error)
    test('Then expect requestFunds to throw a GatewayError', async () => {
      const gatewayError = new GatewayError('Network Error')
      const result = gateway.requestFunds(testUrl)
      await expect(result).rejects.toEqual(gatewayError)
      await expect(result).rejects.toThrow(gatewayError)
      expect(mockedAxiosGet).toHaveBeenCalledTimes(1)
    })
  })
  describe('When Axios fails with a non AxiosError ', () => {
    const error = new Error()
    mockedAxiosGet.mockRejectedValueOnce(error)
    test('Then expect requestFunds to throw a UnspecifiedError', async () => {
      const unspecifiedError = new UnspecifiedError(
        'Oooops... An unspecified error occured while requesting funds..'
      )
      const result = gateway.requestFunds(testUrl)
      await expect(result).rejects.toEqual(unspecifiedError)
      await expect(result).rejects.toThrow(unspecifiedError)
      expect(mockedAxiosGet).toHaveBeenCalledTimes(1)
    })
  })
})
