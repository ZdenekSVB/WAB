import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: ['**/tests/**/*.test.ts'],
    verbose: true,
    globalSetup: '<rootDir>/src/tests/globalSetup.ts',
    globalTeardown: '<rootDir>/src/tests/globalTeardown.ts',
    testTimeout: 30000, // Increase timeout to 30 seconds
};

export default config;