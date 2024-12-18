module.exports = {
  transform: {
    '^.+\\.mjs$': 'babel-jest',
    '^.+\\.js$': 'babel-jest',
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'mjs', 'json'],
  globals: {
    fetch: async () => import('node-fetch').then((mod) => mod.default),
  },
};


