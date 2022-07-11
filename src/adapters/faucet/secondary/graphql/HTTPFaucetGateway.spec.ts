import {
  createClient,
  OperationContext,
  OperationResult,
  PromisifiedSource,
  TypedDocumentNode
} from '@urql/core'
import * as client from './client'
import { FaucetGatewayError, UnspecifiedError } from 'domain/faucet/entity/error'
import { SEND_TOKENS_MUTATION } from './documents/sendTokens'
import { MSendTokensMutation, MSendTokensMutationVariables } from './generated/types'
import { HTTPFaucetGateway } from './HTTPFaucetGateway'
import { DocumentNode } from 'graphql'

const fakeFaucetUrl = 'http://my-awesome-fake-url.com'
const fakeAddress = 'okp4196877dj4crpxmja2ww2hj2vgy45v6uspkzkt8l'
const fakeTxHash = '4ade687e8d9b734a91d08926b950910632e191b836c205cb3280f09f4c4c6fb6'
const fakeUrqlClient = client.default(fakeFaucetUrl)
const fakeOperation = {
  context: {
    url: fakeFaucetUrl,
    requestPolicy: 'network-only'
  },
  key: 'hashKey#1',
  kind: 'mutation',
  query: SEND_TOKENS_MUTATION
}
let fakeUrqlMutationFn: jest.SpyInstance<
  PromisifiedSource<OperationResult<unknown, object>>,
  [
    query: string | DocumentNode | TypedDocumentNode<unknown, object>,
    variables?: object | undefined,
    context?: Partial<OperationContext> | undefined
  ]
>

jest.spyOn(client, 'default').mockImplementation(() => fakeUrqlClient)

describe('Given a HTTPFaucetGateway instance', () => {
  const gateway = new HTTPFaucetGateway(fakeFaucetUrl)
  describe.each`
    hasError | expectedData
    ${false} | ${{ send: { hash: fakeTxHash } }}
    ${false} | ${undefined}
    ${true}  | ${undefined}
  `(
    `And given that expectedData is <$expectedData> and error is <$hasError>`,
    ({ hasError, expectedData }) => {
      describe('When requesting funds', () => {
        beforeEach(() => {
          fakeUrqlMutationFn = jest.spyOn(fakeUrqlClient, 'mutation').mockImplementation(
            (): PromisifiedSource<
              OperationResult<MSendTokensMutation, MSendTokensMutationVariables>
              // @ts-ignore
            > => ({
              toPromise: () =>
                Promise.resolve({
                  operation: fakeOperation,
                  data: expectedData,
                  ...(hasError && {
                    error: {
                      name: 'test-error',
                      message: 'test-message',
                      graphQLErrors: [],
                      networkError: new Error()
                    }
                  })
                })
            })
          )
        })

        afterEach(() => {
          fakeUrqlMutationFn.mockClear()
        })

        test(`Then expect the sendTokens mutation to ${
          hasError || !expectedData ? 'fail' : 'succeed'
        }`, async () => {
          if (hasError) {
            await expect(gateway.requestFunds(fakeAddress)).rejects.toThrowError(
              new FaucetGatewayError('test-message')
            )
          } else if (!hasError && !expectedData) {
            await expect(gateway.requestFunds(fakeAddress)).rejects.toThrowError(
              new UnspecifiedError(
                'Oooops... An unspecified error occured while requesting funds..'
              )
            )
          } else {
            await expect(gateway.requestFunds(fakeAddress)).resolves.toStrictEqual(fakeTxHash)
          }
          expect(fakeUrqlMutationFn).toHaveBeenCalledTimes(1)
          expect(fakeUrqlMutationFn).toHaveBeenCalledWith(SEND_TOKENS_MUTATION, {
            input: { toAddress: fakeAddress }
          })
        })
      })
    }
  )
})
