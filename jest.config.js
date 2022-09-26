/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/adapters/faucet/secondary/graphql/',
    'index.ts',
    'test.helper.ts',
    '<rootDir>/src/adapters/file/secondary/s3/',
    'InMemory'
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
    '^utils': '<rootDir>/src/utils.ts',
    '^uuid$': require.resolve('uuid')
  },
  setupFilesAfterEnv: ['<rootDir>/setup-jest.js']
}
