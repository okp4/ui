import { areFilesAccepted } from './file-utils'

describe('Considering the areFilesAccepted() function', () => {
  describe.each`
    files                                                                                                                                                 | extensions                          | expectedResult
    ${[]}                                                                                                                                                 | ${[]}                               | ${true}
    ${[]}                                                                                                                                                 | ${['jpg', 'png']}                   | ${true}
    ${[{ name: 'file1.jpg', type: 'image/jpg' }]}                                                                                                         | ${[]}                               | ${true}
    ${[{ name: 'file1.txt', type: 'text/plain' }]}                                                                                                        | ${['.txt']}                         | ${true}
    ${[{ name: 'file1.jpg', type: 'image/jpg' }, { name: 'file2.txt', type: 'text/plain' }]}                                                              | ${[]}                               | ${true}
    ${[{ name: 'file1.txt', type: 'text/plain' }, { name: 'file2.csv', type: 'text/csv' }]}                                                               | ${['.txt']}                         | ${false}
    ${[{ name: 'file1.txt', type: 'text/plain' }, { name: 'file2.csv', type: 'text/csv' }]}                                                               | ${['.csv']}                         | ${false}
    ${[{ name: 'file1.jpg', type: 'image/jpg' }, { name: 'file2.xls', type: 'application/vnd.ms-excel' }]}                                                | ${['.xls']}                         | ${false}
    ${[{ name: 'file1.jpg', type: 'image/jpg' }, { name: 'file2.txt', type: 'text/plain' }]}                                                              | ${['jpg', 'png']}                   | ${false}
    ${[{ name: 'file1.txt', type: 'text/plain' }, { name: 'file2.csv', type: 'text/csv' }]}                                                               | ${['.jpg']}                         | ${false}
    ${[{ name: 'file1.jpg', type: 'image/jpg' }, { name: 'file2.xlsx', type: 'application/vnd.ms-excel' }]}                                               | ${['.xls']}                         | ${false}
    ${[{ name: 'file1.txt', type: 'text/plain' }, { name: 'file2.csv', type: 'text/csv' }]}                                                               | ${['.txt', '.csv']}                 | ${true}
    ${[{ name: 'file1.jpg', type: 'image/jpg' }, { name: 'file2.png', type: 'image/png' }]}                                                               | ${['.jpg', 'jpeg', 'png']}          | ${true}
    ${[{ name: 'file1.jpg', type: 'image/jpg' }, { name: 'file2.png', type: 'image/png' }]}                                                               | ${['image/jpg', 'image/png']}       | ${true}
    ${[{ name: 'file1.jpg', type: 'image/jpg' }, { name: 'file2.png', type: 'image/png' }]}                                                               | ${['image/*']}                      | ${true}
    ${[{ name: 'file1.jpg', type: 'image/jpg' }, { name: 'file2.gif', type: 'image/gif' }]}                                                               | ${['.jpg', 'jpeg', 'png']}          | ${false}
    ${[{ name: 'file1.pdf', type: 'application/pdf' }, { name: 'file2.xls', type: 'application/vnd.ms-excel' }, { name: 'file2.csv', type: 'text/csv' }]} | ${['.xls', '.xlsx', 'csv']}         | ${false}
    ${[{ name: 'file1.pdf', type: 'application/pdf' }, { name: 'file2.xls', type: 'application/vnd.ms-excel' }, { name: 'file2.csv', type: 'text/csv' }]} | ${['.pdf', '.xls', '.xlsx', 'csv']} | ${true}
  `(
    'Given the value <$files> with the extensions <$extensions>',
    ({
      files,
      extensions,
      expectedResult
    }: {
      files: File[]
      extensions: string[]
      expectedResult: number
    }) => {
      describe('When calling function', () => {
        const result = areFilesAccepted(files, extensions)

        test(`Then, result value is ${expectedResult}`, () => {
          expect(result).toEqual(expectedResult)
        })
      })
    }
  )
})
