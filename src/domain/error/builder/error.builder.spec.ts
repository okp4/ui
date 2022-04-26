import type { DeepReadonly } from 'superTypes'
import { Error, UnspecifiedError } from '../entity/error'
import type { Id } from '../entity/error'
import { ErrorBuilder } from './error.builder'

type Data = Readonly<{
  isFullError: boolean
  id: Id
  timestamp: Readonly<Date>
  messageKey: string
  type: string
  context: DeepReadonly<Record<string, unknown>>
}>

describe('Build an error', () => {
  const buildFullError = (
    id: Id,
    timestamp: Readonly<Date>,
    messageKey: string,
    type: string,
    context?: DeepReadonly<Record<string, unknown>>
  ): Error =>
    new ErrorBuilder()
      .withId(id)
      .withTimestamp(timestamp)
      .withMessageKey(messageKey)
      .withType(type)
      .withContext(context)
      .build()

  const buildPartialError = (messageKey: string): Error =>
    new ErrorBuilder().withMessageKey(messageKey).build()

  describe.each`
    isFullError | id        | timestamp     | messageKey                          | type                  | context
    ${true}     | ${''}     | ${new Date()} | ${'dommain.error.connection-error'} | ${'connection-error'} | ${{ stack: new Error().stack }}
    ${true}     | ${'#id1'} | ${undefined}  | ${'dommain.error.connection-error'} | ${'connection-error'} | ${{ stack: new Error().stack }}
    ${true}     | ${'#id1'} | ${new Date()} | ${''}                               | ${'connection-error'} | ${{ stack: new Error().stack }}
    ${true}     | ${'#id1'} | ${new Date()} | ${'dommain.error.connection-error'} | ${''}                 | ${{}}
    ${false}    | ${'#id1'} | ${new Date()} | ${'dommain.error.connection-error'} | ${'connection-error'} | ${{}}
  `(
    'Given that isFullError is <$isFullError>, id is <$id>, timestamp is <$timestamp>, messageKey is <$messageKey>, type is <$type> and context is <$context>',
    ({ isFullError, id, timestamp, messageKey, type, context }: Data) => {
      describe('When building error ', () => {
        const error = (): Error =>
          isFullError
            ? buildFullError(id, timestamp, messageKey, type, context)
            : buildPartialError(messageKey)
        test('Then, expect ErrorBuilder to throw an UnspecifiedError', () => {
          expect(error).toThrowError(UnspecifiedError)
        })
      })
    }
  )

  describe('Given that id, timestamp, messageKey, type and context are correctly provided', () => {
    const id = '#id12'
    const timestamp = new Date(1995, 11, 17)
    const messageKey = 'domain.error.validation-error'
    const type = 'validation-error'
    describe('When building account', () => {
      const account = buildFullError(id, timestamp, messageKey, type)
      test('Then, expect builder to construct a valid Error ', () => {
        expect(account).toEqual({
          id,
          timestamp,
          messageKey,
          type,
          context: {}
        })
      })
    })
  })
})
