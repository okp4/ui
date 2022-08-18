import short from 'short-uuid'
import type { DeepReadonly } from 'superTypes'
import { UnspecifiedError } from '../entity/error'
import type { FileEntity } from '../entity/file'
import { FileBuilder } from './file.builder'

type Data = Readonly<
  Partial<{
    initialFile: FileEntity
    id: string
    name: string
    size: number
    type: string
    stream: ReadableStream
  }> & {
    expectedStatus: boolean
  }
>
const fakeStream = new ReadableStream()
const mocked = jest.spyOn(global, 'ReadableStream').mockImplementation(() => fakeStream)

describe('Build a File', () => {
  const fakedUuid = 'foobar'

  beforeAll(() => {
    short.generate = jest.fn(() => fakedUuid as short.SUUID)
  })

  describe.each`
    initialFile  | id        | name                 | size  | type           | stream        | expectedStatus
    ${undefined} | ${'#id1'} | ${'my-awesome-file'} | ${10} | ${'image/png'} | ${fakeStream} | ${true}
  `(
    'Given that id is <$id>, name is <$name>, size is <$size>, type is <$type> and stream is <$stream>',
    ({ initialFile, id, name, size, type, stream, expectedStatus }: Data) => {
      describe('When building a file', () => {
        const file = (): FileEntity => {
          // eslint-disable-next-line functional/no-let
          let fileBuilder = new FileBuilder(initialFile)

          if (id !== undefined) {
            fileBuilder = fileBuilder.withId(id)
          }
          if (name !== undefined) {
            fileBuilder = fileBuilder.withName(name)
          }
          if (size !== undefined) {
            fileBuilder = fileBuilder.withSize(size)
          }
          if (type !== undefined) {
            fileBuilder = fileBuilder.withType(type)
          }
          if (stream !== undefined) {
            fileBuilder = fileBuilder.withStream(stream)
          }
          return fileBuilder.build()
        }

        test(`Then, expect FileBuilder to ${expectedStatus ? 'succeed' : 'fail'}`, () => {
          if (expectedStatus) {
            expect(file()).toEqual({
              id: id === undefined ? fakedUuid : id,
              name,
              type,
              size,
              stream
            })
          } else {
            expect(file).toThrowError(UnspecifiedError)
          }
        })
      })
    }
  )
})

// ${undefined}          | ${'#id2'}    | ${aDate}     | ${'domain.error.validation-error'} | ${'validation-error'} | ${'test'} | ${true}
// ${undefined}          | ${'#id3'}    | ${aDate}     | ${'domain.error.validation-error'} | ${'validation-error'} | ${'test'} | ${true}
// ${undefined}          | ${undefined} | ${aDate}     | ${'domain.error.validation-error'} | ${'validation-error'} | ${'test'} | ${true}
// ${undefined}          | ${'#id5'}    | ${undefined} | ${'domain.error.validation-error'} | ${'validation-error'} | ${'test'} | ${true}
// ${undefined}          | ${''}        | ${aDate}     | ${'domain.error.validation-error'} | ${'validation-error'} | ${'test'} | ${false}
// ${undefined}          | ${'#id7'}    | ${aDate}     | ${''}                              | ${'validation-error'} | ${'test'} | ${false}
// ${undefined}          | ${'#id8'}    | ${aDate}     | ${'domain.error.validation-error'} | ${''}                 | ${'test'} | ${false}
// ${{ messageKey: '' }} | ${'#id8'}    | ${undefined} | ${undefined}                       | ${undefined}          | ${'test'} | ${false}
// ${undefined}          | ${'#id8'}    | ${aBadDate}  | ${'domain.error.validation-error'} | ${''}                 | ${'test'} | ${false}
// ${undefined}          | ${'#id8'}    | ${aDate}     | ${'domain.error.validation-error'} | ${'validation-error'} | ${''}     | ${false}
