import {
  capitalizeFirstLetter,
  capitalizeFirstLetterOfEachArrayWord,
  getOptionsAscendingSorted,
  getOptionsDescendingSorted,
  SelectOption,
  toPercent
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

describe('Considering the capitalizeFirstLetter() function', () => {
  describe.each`
    value        | expectedResult
    ${''}        | ${''}
    ${'foo'}     | ${'Foo'}
    ${'foo bar'} | ${'Foo bar'}
  `(
    'Given the value <$value>',
    ({ value, expectedResult }: { value: string; expectedResult: string }) => {
      describe('When calling function', () => {
        const result = capitalizeFirstLetter(value)

        test(`Then, result value is ${expectedResult}`, () => {
          expect(result).toEqual(expectedResult)
        })
      })
    }
  )
})

describe('Considering the capitalizeFirstLetterOfEachArrayWord() function', () => {
  describe.each`
    value             | expectedResult
    ${['']}           | ${['']}
    ${['foo']}        | ${['Foo']}
    ${['foo bar']}    | ${['Foo bar']}
    ${['foo', 'bar']} | ${['Foo', 'Bar']}
  `(
    'Given the value <$value>',
    ({ value, expectedResult }: { value: string[]; expectedResult: string[] }) => {
      describe('When calling function', () => {
        const result = capitalizeFirstLetterOfEachArrayWord(value)

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
        const result = getOptionsAscendingSorted(value)

        test(`Then, result value is ${expectedResult}`, () => {
          expect(result).toEqual(expectedResult)
        })
      })
      describe('When calling function getOptionsDescendingSorted', () => {
        const result = getOptionsDescendingSorted(value)
        const expectedReverse = [...expectedResult].reverse()
        test(`Then, result value is ${expectedReverse}`, () => {
          expect(result).toEqual(expectedReverse)
        })
      })
    }
  )
})
