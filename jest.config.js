/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { compilerOptions } = require('./tsconfig')

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  coveragePathIgnorePatterns: ['<rootDir>/src/adapters/faucet/secondary/graphql/documents/'],
  globals: {
    window: {}
  },
  transform: {
    '\\.(gql|graphql)$': 'jest-transform-graphql'
  }
}
