export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'services/**/*.js',
    '!**/node_modules/**'
  ]
};
