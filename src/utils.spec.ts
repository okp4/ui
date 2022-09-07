import { FileSizeUnit } from 'superTypes'
import {
  sortSelectOptionAsc,
  sortSelectOptionDesc,
  SelectOption,
  toPercent,
  toReadableFileSize,
  isFileTypeAccepted,
  areFilesAccepted
} from './utils'

describe('Considering the toPercent() function', () => {
  describe.each`
    value  | min     | max    | expectedResult
    ${0}   | ${0}    | ${100} | ${0}
    ${100} | ${0}    | ${100} | ${100}
    ${44}  | ${0}    | ${100} | ${44}
    ${65}  | ${50}   | ${87}  | ${40.54054054054054}
    ${6}   | ${10}   | ${20}  | ${0}
    ${104} | ${20}   | ${103} | ${100}
    ${0}   | ${-100} | ${100} | ${50}
    ${24}  | ${0}    | ${20}  | ${100}
    ${5}   | ${10}   | ${20}  | ${0}
    ${60}  | ${100}  | ${0}   | ${0}
    ${-5}  | ${40}   | ${-20} | ${0}
  `(
    'Given a value <$value> with [<$min>, <$max>] bounding interval',
    ({
      value,
      min,
      max,
      expectedResult
    }: {
      value: number
      min: number
      max: number
      expectedResult: number
    }) => {
      describe('When calling function', () => {
        const result = toPercent(value, min, max)

        test(`Then, result value is ${expectedResult}`, () => {
          expect(result).toEqual(expectedResult)
        })
      })
    }
  )
})

describe('Considering the getOptions(Ascending|Descending)Sorted() function', () => {
  const opt = (label: string, value: string, group?: string) => ({ label, value, group })
  describe.each`
    value                                                              | expectedResult
    ${[]}                                                              | ${[]}
    ${[opt('a', '0')]}                                                 | ${[opt('a', '0')]}
    ${[opt('b', '0'), opt('a', '1')]}                                  | ${[opt('b', '0'), opt('a', '1')]}
    ${[opt('a', '1'), opt('b', '0')]}                                  | ${[opt('b', '0'), opt('a', '1')]}
    ${[opt('a', '1', 'g'), opt('b', '0', 'g')]}                        | ${[opt('b', '0', 'g'), opt('a', '1', 'g')]}
    ${[opt('a', '1', 'g1'), opt('b', '0', 'g2')]}                      | ${[opt('a', '1', 'g1'), opt('b', '0', 'g2')]}
    ${[opt('a', '1', 'g2'), opt('b', '0', 'g1')]}                      | ${[opt('b', '0', 'g1'), opt('a', '1', 'g2')]}
    ${[opt('a', '1', 'g1'), opt('c', '0', 'g2'), opt('b', '0', 'g1')]} | ${[opt('b', '0', 'g1'), opt('a', '1', 'g1'), opt('c', '0', 'g2')]}
  `(
    'Given the value <$value>',
    ({ value, expectedResult }: { value: SelectOption[]; expectedResult: SelectOption[] }) => {
      describe('When calling function getOptionsAscendingSorted', () => {
        const result = sortSelectOptionAsc(value)

        test(`Then, result value is ${expectedResult}`, () => {
          expect(result).toEqual(expectedResult)
        })
      })
      describe('When calling function getOptionsDescendingSorted', () => {
        const result = sortSelectOptionDesc(value)
        const expectedReverse = [...expectedResult].reverse()
        test(`Then, result value is ${expectedReverse}`, () => {
          expect(result).toEqual(expectedReverse)
        })
      })
    }
  )
})

describe('Considering the toReadableSize() function', () => {
  describe.each`
    size                 | formatter                                   | expectedResult
    ${0}                 | ${undefined}                                | ${{ value: 0, unit: 'B' }}
    ${175}               | ${(n: number) => Math.round(n * 100) / 100} | ${{ value: 175.0, unit: 'B' }}
    ${1000}              | ${undefined}                                | ${{ value: 1.0, unit: 'KB' }}
    ${1755}              | ${undefined}                                | ${{ value: 1.755, unit: 'KB' }}
    ${1989}              | ${undefined}                                | ${{ value: 1.989, unit: 'KB' }}
    ${19891}             | ${(n: number) => Math.round(n * 100) / 100} | ${{ value: 19.89, unit: 'KB' }}
    ${198911}            | ${undefined}                                | ${{ value: 198.911, unit: 'KB' }}
    ${2777444}           | ${undefined}                                | ${{ value: 2.777444, unit: 'MB' }}
    ${27774443}          | ${(n: number) => Number(n.toFixed(1))}      | ${{ value: 27.8, unit: 'MB' }}
    ${277744433}         | ${(n: number) => Number(n.toFixed(2))}      | ${{ value: 277.74, unit: 'MB' }}
    ${1234567890}        | ${(n: number) => Number(n.toFixed(2))}      | ${{ value: 1.23, unit: 'GB' }}
    ${12345678912}       | ${(n: number) => Number(n.toFixed(2))}      | ${{ value: 12.35, unit: 'GB' }}
    ${123456789123}      | ${(n: number) => Number(n.toFixed(2))}      | ${{ value: 123.46, unit: 'GB' }}
    ${1234567891234}     | ${(n: number) => Number(n.toFixed(5))}      | ${{ value: 1.23457, unit: 'TB' }}
    ${12345678912345}    | ${(n: number) => Number(n.toFixed(4))}      | ${{ value: 12.3457, unit: 'TB' }}
    ${123456789123456}   | ${(n: number) => Number(n.toFixed(3))}      | ${{ value: 123.457, unit: 'TB' }}
    ${1234567891234567}  | ${(n: number) => Number(n.toFixed(2))}      | ${{ value: 1234.57, unit: 'TB' }}
    ${12345678912345678} | ${(n: number) => Number(n.toFixed(1))}      | ${{ value: 12345.7, unit: 'TB' }}
  `(
    'Given the value <$size> and the formatter<$formatter>',
    ({
      size,
      formatter,
      expectedResult
    }: {
      size: number
      formatter: (size: number) => number
      expectedResult: { value: string; unit: FileSizeUnit }
    }) => {
      describe('When calling function', () => {
        const result = toReadableFileSize(size, formatter)

        test(`Then, result value is ${expectedResult}`, () => {
          expect(result).toEqual(expectedResult)
        })
      })
    }
  )
})

describe('Considering the isFileTypeAccepted() function', () => {
  describe.each`
    file                                                      | type            | expectedResult
    ${{ name: 'file.jpg', type: 'image/jpg' }}                | ${''}           | ${true}
    ${{ name: 'file.png', type: 'image/png' }}                | ${'.png'}       | ${true}
    ${{ name: 'file.gif', type: 'image/gif' }}                | ${'image/*'}    | ${true}
    ${{ name: 'file.pdf', type: 'application/pdf' }}          | ${'.pdf'}       | ${true}
    ${{ name: 'file.xls', type: 'application/vnd.ms-excel' }} | ${'.xls'}       | ${true}
    ${{ name: 'file.csv', type: 'text/csv' }}                 | ${'image/*'}    | ${false}
    ${{ name: 'file.txt', type: 'text/plain' }}               | ${'.txt'}       | ${true}
    ${{ name: 'file.jpg', type: 'image/jpg' }}                | ${'image/jpg'}  | ${true}
    ${{ name: 'file.png', type: 'image/png' }}                | ${'text/plain'} | ${false}
    ${{ name: 'file.gif', type: 'image/gif' }}                | ${'image/png'}  | ${false}
    ${{ name: 'file.txt', type: 'text/plain' }}               | ${'.csv'}       | ${false}
    ${{ name: 'file.txt', type: 'text/plain' }}               | ${'text/csv'}   | ${false}
    ${{ name: 'file.pdf', type: 'application/pdf' }}          | ${'image/jpg'}  | ${false}
    ${{ name: 'file.xls', type: 'application/vnd.ms-excel' }} | ${'image/*'}    | ${false}
    ${{ name: 'file.csv', type: 'text/csv' }}                 | ${'image/*'}    | ${false}
    ${{ name: 'file.txt', type: 'text/plain' }}               | ${'.gif'}       | ${false}
  `(
    'Given the value <$file> with the type <$type>',
    ({ file, type, expectedResult }: { file: File; type: string; expectedResult: boolean }) => {
      describe('When calling function', () => {
        const result = isFileTypeAccepted(file, type)

        test(`Then, result value is ${expectedResult}`, () => {
          expect(result).toEqual(expectedResult)
        })
      })
    }
  )
})

describe('Considering the areFilesAccepted() function', () => {
  describe.each`
    files                                                                                                                                                 | extensions                           | expectedResult
    ${[]}                                                                                                                                                 | ${[]}                                | ${true}
    ${[]}                                                                                                                                                 | ${['jpg', 'png']}                    | ${true}
    ${[{ name: 'file1.jpg', type: 'image/jpg' }]}                                                                                                         | ${[]}                                | ${true}
    ${[{ name: 'file1.txt', type: 'text/plain' }]}                                                                                                        | ${['.txt']}                          | ${true}
    ${[{ name: 'file1.jpg', type: 'image/jpg' }, { name: 'file2.txt', type: 'text/plain' }]}                                                              | ${[]}                                | ${true}
    ${[{ name: 'file1.txt', type: 'text/plain' }, { name: 'file2.csv', type: 'text/csv' }]}                                                               | ${['.txt']}                          | ${false}
    ${[{ name: 'file1.txt', type: 'text/plain' }, { name: 'file2.csv', type: 'text/csv' }]}                                                               | ${['.csv']}                          | ${false}
    ${[{ name: 'file1.jpg', type: 'image/jpg' }, { name: 'file2.xls', type: 'application/vnd.ms-excel' }]}                                                | ${['.xls']}                          | ${false}
    ${[{ name: 'file1.jpg', type: 'image/jpg' }, { name: 'file2.txt', type: 'text/plain' }]}                                                              | ${['.jpg', '.png']}                  | ${false}
    ${[{ name: 'file1.txt', type: 'text/plain' }, { name: 'file2.csv', type: 'text/csv' }]}                                                               | ${['.jpg']}                          | ${false}
    ${[{ name: 'file1.jpg', type: 'image/jpg' }, { name: 'file2.xlsx', type: 'application/vnd.ms-excel' }]}                                               | ${['.xls']}                          | ${false}
    ${[{ name: 'file1.txt', type: 'text/plain' }, { name: 'file2.csv', type: 'text/csv' }]}                                                               | ${['.txt', '.csv']}                  | ${true}
    ${[{ name: 'file1.jpg', type: 'image/jpg' }, { name: 'file2.png', type: 'image/png' }]}                                                               | ${['.jpg', '.jpeg', '.png']}         | ${true}
    ${[{ name: 'file1.jpg', type: 'image/jpg' }, { name: 'file2.png', type: 'image/png' }]}                                                               | ${['image/jpg', 'image/png']}        | ${true}
    ${[{ name: 'file1.jpg', type: 'image/jpg' }, { name: 'file2.png', type: 'image/png' }]}                                                               | ${['image/*']}                       | ${true}
    ${[{ name: 'file1.jpg', type: 'image/jpg' }, { name: 'file2.gif', type: 'image/gif' }]}                                                               | ${['.jpg', '.jpeg', '.png']}         | ${false}
    ${[{ name: 'file1.pdf', type: 'application/pdf' }, { name: 'file2.xls', type: 'application/vnd.ms-excel' }, { name: 'file2.csv', type: 'text/csv' }]} | ${['.xls', '.xlsx', '.csv']}         | ${false}
    ${[{ name: 'file1.pdf', type: 'application/pdf' }, { name: 'file2.xls', type: 'application/vnd.ms-excel' }, { name: 'file2.csv', type: 'text/csv' }]} | ${['.pdf', '.xls', '.xlsx', '.csv']} | ${true}
    ${[{ name: 'file1.pdf', type: 'application/pdf' }, { name: 'file2.xls', type: 'application/vnd.ms-excel' }, { name: 'file2.csv', type: 'text/csv' }]} | ${['foo', 'bar']}                    | ${false}
  `(
    'Given the value <$files> with the extensions <$extensions>',
    ({
      files,
      extensions,
      expectedResult
    }: {
      files: File[]
      extensions: string[]
      expectedResult: boolean
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
