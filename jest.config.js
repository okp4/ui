/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/adapters/faucet/secondary/graphql/documents/',
    'index.ts',
    'test.helper.ts'
  ],
  globals: {
    window: {}
  },
  transform: {
    '\\.(gql|graphql)$': 'jest-transform-graphql',
    '^.+\\.(t|j)s?$': ['@swc/jest']
  },
  transformIgnorePatterns: ['node_modules/(?!(short-uuid|uuid))'],
  moduleNameMapper: {
    '^domain/(.*)$': '<rootDir>/src/domain/$1',
    '^adapters/(.*)$': '<rootDir>/src/adapters/$1',
    '^utils': '<rootDir>/src/utils.ts'
  },
  setupFilesAfterEnv: ['<rootDir>/setup-jest.js']
}
