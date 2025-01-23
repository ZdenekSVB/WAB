import type { Config } from 'jest';
import * as dotenv from 'dotenv';
import * as path from 'path';


// Load environment variables from .env.test
dotenv.config({ path: path.resolve(__dirname, '.env.test') });

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1', // Map @/ to src/
    },
    testMatch: ['**/tests/**/*.test.ts'], // Match test files
    verbose: true, // Show detailed test output
    globalSetup: '<rootDir>/src/tests/globalSetup.ts', // Path to global setup file
    globalTeardown: '<rootDir>/src/tests/globalTeardown.ts', // Path to global teardown file
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Load environment variables before tests
    testTimeout: 30000, // Increase timeout to 30 seconds
};

export default config;