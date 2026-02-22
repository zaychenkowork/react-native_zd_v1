/** @type {import('jest').Config} */
const config = {
  preset: 'jest-expo',

  setupFilesAfterEnv: ['<rootDir>/__tests__/setup/setup.ts'],

  testMatch: ['<rootDir>/__tests__/**/*.test.{ts,tsx}'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@env$': '<rootDir>/env.ts',
    '^@tests/(.*)$': '<rootDir>/__tests__/$1',
    '\\.svg$': '<rootDir>/__tests__/setup/svgMock.tsx',
    // Prevent Expo's lazy globals from crashing during Jest teardown.
    // Node.js already provides TextDecoder, URL, structuredClone etc. natively.
    '^expo/src/winter$': '<rootDir>/__tests__/setup/empty.ts',
  },

  testPathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
    '__tests__/setup/',
  ],

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/app/**',
  ],
};

module.exports = config;
