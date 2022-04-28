import short from 'short-uuid'
import type { DeepReadonly } from 'superTypes'
import { UnspecifiedError } from '../entity/error'
import type { Error, Id } from '../entity/error'
import { ErrorBuilder } from './error.builder'

type Data = Readonly<
  Partial<{
    initialError: Error
    id: Id
    timestamp: Readonly<Date>
    messageKey: string
    type: string
    context: DeepReadonly<Record<string, unknown>>
  }> & {
    expectedStatus: boolean
  }
>

describe('Build an error', () => {
  const aDate = new Date(1995, 11, 17)
  const aBadDate = {}
  const fakedDate = new Date(2022, 1, 1)
  const fakedUuid = 'foobar'

  beforeAll(() => {
    short.generate = jest.fn(() => fakedUuid as short.SUUID)

    jest.useFakeTimers('modern')
    jest.setSystemTime(fakedDate)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe.each`
    initialError          | id           | timestamp    | messageKey                         | type                  | context           | expectedStatus
    ${undefined}          | ${'#id1'}    | ${aDate}     | ${'domain.error.validation-error'} | ${'validation-error'} | ${{}}             | ${true}
    ${undefined}          | ${'#id2'}    | ${aDate}     | ${'domain.error.validation-error'} | ${'validation-error'} | ${{ foo: 'bar' }} | ${true}
    ${undefined}          | ${'#id3'}    | ${aDate}     | ${'domain.error.validation-error'} | ${'validation-error'} | ${null}           | ${true}
    ${undefined}          | ${undefined} | ${aDate}     | ${'domain.error.validation-error'} | ${'validation-error'} | ${{}}             | ${true}
    ${undefined}          | ${'#id5'}    | ${undefined} | ${'domain.error.validation-error'} | ${'validation-error'} | ${{}}             | ${true}
    ${undefined}          | ${''}        | ${aDate}     | ${'domain.error.validation-error'} | ${'validation-error'} | ${{}}             | ${false}
    ${undefined}          | ${'#id7'}    | ${aDate}     | ${''}                              | ${'validation-error'} | ${{}}             | ${false}
    ${undefined}          | ${'#id8'}    | ${aDate}     | ${'domain.error.validation-error'} | ${''}                 | ${{}}             | ${false}
    ${{ messageKey: '' }} | ${'#id8'}    | ${undefined} | ${undefined}                       | ${undefined}          | ${{}}             | ${false}
    ${undefined}          | ${'#id8'}    | ${aBadDate}  | ${'domain.error.validation-error'} | ${''}                 | ${{}}             | ${false}
  `(
    'Given that id is <$id>, timestamp is <$timestamp>, messageKey is <$messageKey>, type is <$type> and context is <$context>',
    ({ initialError, id, timestamp, messageKey, type, context, expectedStatus }: Data) => {
      describe('When building error', () => {
        const error = (): Error => {
          // eslint-disable-next-line functional/no-let
          let errorBuilder = new ErrorBuilder(initialError)

          if (id !== undefined) {
            errorBuilder = errorBuilder.withId(id)
          }
          if (timestamp !== undefined) {
            errorBuilder = errorBuilder.withTimestamp(timestamp)
          }
          if (messageKey !== undefined) {
            errorBuilder = errorBuilder.withMessageKey(messageKey)
          }
          if (type !== undefined) {
            errorBuilder = errorBuilder.withType(type)
          }
          if (context !== undefined) {
            errorBuilder = errorBuilder.withContext(context)
          }
          return errorBuilder.build()
        }

        test(`Then, expect ErrorBuilder to ${expectedStatus ? 'succeed' : 'fail'}`, () => {
          if (expectedStatus) {
            expect(error()).toEqual({
              id: id === undefined ? fakedUuid : id,
              timestamp: timestamp === undefined ? fakedDate : timestamp,
              messageKey,
              type,
              context: !context || !Object.keys(context).length ? {} : context
            })
          } else {
            expect(error).toThrowError(UnspecifiedError)
          }
        })
      })
    }
  )
})
