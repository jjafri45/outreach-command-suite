module.exports = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['src/**/*.js'],
  coverageThreshold: {
    global: { branches: 65, functions: 80, lines: 80, statements: 80 },
  },
};
