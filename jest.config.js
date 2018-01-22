// Jest configuration
// https://facebook.github.io/jest/docs/en/configuration.html
module.exports = {
  // Modules can be explicitly auto-mocked using jest.mock(moduleName).
  // https://facebook.github.io/jest/docs/en/configuration.html#automock-boolean
  automock: false, // [boolean]

  // Respect Browserify's "browser" field in package.json when resolving modules.
  // https://facebook.github.io/jest/docs/en/configuration.html#browser-boolean
  browser: false, // [boolean]

  // This config option can be used here to have Jest stop running tests after the first failure.
  // https://facebook.github.io/jest/docs/en/configuration.html#bail-boolean
  bail: false, // [boolean]

  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/registerServiceWorker.js',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],

  coverageDirectory: '<rootDir>/coverage', // [string]

  globals: {
    __DEV__: true,
  },

  moduleFileExtensions: ['js', 'json', 'jsx', 'node'],

  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
  },

  transform: {
    '\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
    '^(?!.*\\.(js|jsx|json|css)$)': '<rootDir>/tools/lib/fileTransformer.js',
  },

  setupTestFrameworkScriptFile: '<rootDir>tools/test-run.js',

  verbose: true, // [boolean]
}
