module.exports = {
  verbose: true,

  testEnvironment: 'node',

  roots: ['<rootDir>/test'],

  testMatch: ['**/*.test.ts'],

  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
  },

  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
