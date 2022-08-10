import { capitalizeFirstLetter, toPercent } from './utils'

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
