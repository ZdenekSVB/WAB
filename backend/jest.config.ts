module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    collectCoverage: true,
    coverageReporters: ['text', 'lcov'],
    testTimeout: 30000, // Set timeout to 30 seconds
};