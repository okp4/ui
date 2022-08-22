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

describe('Build a File', () => {
  const fakedUuid = 'foobar'

  beforeAll(() => {
    short.generate = jest.fn(() => fakedUuid as short.SUUID)
  })

  describe.each`
    initialFile                    | id           | name                 | size         | type           | stream                  | expectedStatus
    ${undefined}                   | ${'#id1'}    | ${'my-awesome-file'} | ${10}        | ${'image/png'} | ${new ReadableStream()} | ${true}
    ${undefined}                   | ${undefined} | ${'my-awesome-file'} | ${10}        | ${'image/png'} | ${new ReadableStream()} | ${true}
    ${{ name: 'my-awesome-file' }} | ${'#id3'}    | ${undefined}         | ${10}        | ${'image/png'} | ${new ReadableStream()} | ${true}
    ${undefined}                   | ${'#id4'}    | ${undefined}         | ${10}        | ${'image/png'} | ${new ReadableStream()} | ${false}
    ${undefined}                   | ${'#id5'}    | ${'my-awesome-file'} | ${undefined} | ${'image/png'} | ${new ReadableStream()} | ${false}
    ${undefined}                   | ${'#id6'}    | ${'my-awesome-file'} | ${10}        | ${undefined}   | ${new ReadableStream()} | ${false}
    ${undefined}                   | ${'#id7'}    | ${'my-awesome-file'} | ${10}        | ${'image/png'} | ${undefined}            | ${false}
    ${{ stream: {} }}              | ${'#id8'}    | ${'my-awesome-file'} | ${10}        | ${'image/png'} | ${undefined}            | ${false}
    ${{ name: 10 }}                | ${'#id9'}    | ${undefined}         | ${10}        | ${'image/png'} | ${new ReadableStream()} | ${false}
    ${{ name: '' }}                | ${'#id10'}   | ${undefined}         | ${10}        | ${'image/png'} | ${new ReadableStream()} | ${false}
    ${undefined}                   | ${''}        | ${undefined}         | ${10}        | ${'image/png'} | ${new ReadableStream()} | ${false}
    ${undefined}                   | ${'#id11'}   | ${''}                | ${10}        | ${'image/png'} | ${new ReadableStream()} | ${false}
    ${undefined}                   | ${'#id12'}   | ${'my-awesome-file'} | ${0}         | ${'image/png'} | ${new ReadableStream()} | ${false}
    ${undefined}                   | ${'#id12'}   | ${'my-awesome-file'} | ${10}        | ${''}          | ${new ReadableStream()} | ${false}
    ${undefined}                   | ${'#id12'}   | ${'my-awesome-file'} | ${10}        | ${'image/png'} | ${{}}                   | ${false}
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
              name: name ? name : initialFile?.name ? initialFile.name : undefined,
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
