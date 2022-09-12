import { progressInvariant } from './task.utils'

describe('Considering the progressInvariant() function', () => {
  describe.each`
    current      | min          | max          | expectedResult
    ${undefined} | ${undefined} | ${undefined} | ${true}
    ${10}        | ${undefined} | ${undefined} | ${true}
    ${undefined} | ${0}         | ${undefined} | ${true}
    ${undefined} | ${undefined} | ${100}       | ${true}
    ${undefined} | ${0}         | ${100}       | ${true}
    ${10}        | ${0}         | ${100}       | ${true}
    ${undefined} | ${101}       | ${100}       | ${false}
    ${undefined} | ${0}         | ${-10}       | ${false}
    ${10}        | ${20}        | ${100}       | ${false}
    ${110}       | ${0}         | ${100}       | ${false}
  `(
    'Given a value <$value> with [<$min>, <$max>] bounding interval',
    ({ current, min, max, expectedResult }) => {
      describe('When calling function', () => {
        const result = progressInvariant({ current, min, max })

        test(`Then, result value is ${expectedResult}`, () => {
          expect(result).toEqual(expectedResult)
        })
      })
    }
  )
})
