const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.spec');

module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.spec.json'
    },
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, { prefix: '<rootDir>/' }),
  modulePaths: ['<rootDir>/'],
  preset: 'ts-jest',
  rootDir: 'src',

};
