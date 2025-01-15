/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  // Use the default TypeScript preset with ES module support
  preset: 'ts-jest/presets/default-esm',

  // Setup file to initialize global variables for tests
  setupFiles: ['./jest.globalSetup.js'],

  // Set the environment to Node.js for backend testing
  testEnvironment: 'node',

  // Transform TypeScript files with ts-jest and enable ESM support
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },

  // Treat TypeScript files as ES modules
  extensionsToTreatAsEsm: ['.ts', '.tsx'],

  // Map .js imports in TypeScript to their corresponding paths
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  maxWorkers: 1,

  // Stop the test suite on the first failure
  // bail: true,
};
