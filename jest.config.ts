import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: ['**/src/tests/**/*.test.ts', '**/src/tests/**/*.spec.ts'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1' // Điều này giúp Jest hiểu alias ~
  }
}

export default config
