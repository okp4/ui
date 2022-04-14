import axios from 'axios'
import { UnspecifiedError } from 'domain/wallet/entities/errors'
import { HTTPFaucetGateway } from './HTTPFaucetGateway'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>
const testUrl = 'http://my-test-fake-url.com'

afterEach(() => {
  jest.clearAllMocks()
})

describe('Given an HTTPFaucetGateway instance', () => {
  const gateway = new HTTPFaucetGateway(testUrl)
  describe('When requesting funds', () => {
    mockedAxios.get.mockResolvedValueOnce(testUrl)
    test('Then expect the HTTPFaucetGateway to succeed', async () => {
      const result = await gateway.requestFunds(testUrl)
      expect(mockedAxios.get).toHaveBeenCalledWith(testUrl, {
        params: {
          address: testUrl
        }
      })
      expect(result).toEqual(undefined)
      expect(mockedAxios.get).toHaveBeenCalledTimes(1)
    })
  })
})

describe('Given an HTTPFaucetGateway instance', () => {
  const gateway = new HTTPFaucetGateway(testUrl)
  describe('When requesting funds', () => {
    const error = new UnspecifiedError(
      'Oooops... An unspecified error occured while requesting funds..'
    )
    mockedAxios.get.mockRejectedValueOnce(error)
    test('Then expect the HTTPFaucetGateway to fail', async () => {
      const result = gateway.requestFunds(testUrl)
      await expect(result).rejects.toEqual(error)
      expect(mockedAxios.get).toHaveBeenCalledTimes(1)
    })
  })
})
