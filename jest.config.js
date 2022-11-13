/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // [...]
  moduleNameMapper: {
    '^guides/(.*)$': '<rootDir>/src/guides/$1',
  },
}
