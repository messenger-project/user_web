module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: ['/node_modules/(?!zod|@hookform/resolvers)'],
  setupFilesAfterEnv: ['./setupTests.js'],
};
