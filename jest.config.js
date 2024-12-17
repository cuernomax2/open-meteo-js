// jest.config.js
module.exports = {
  transform: {
    '^.+\\.mjs$': 'babel-jest',  // Ensure .mjs files are transpiled by Babel
    '^.+\\.js$': 'babel-jest',   // Optional: for .js files too
  },
  testEnvironment: 'node',           // Use Node environment (necessary for fetch)
  moduleFileExtensions: ['js', 'mjs', 'json'],  // Ensure Jest handles .mjs files
  globals: {
    fetch: async () => import('node-fetch').then((mod) => mod.default),  // Dynamically import fetch
  },
};


