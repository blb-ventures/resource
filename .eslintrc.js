const path = require('path');
const tsconfigPath = path.resolve(__dirname, './tsconfig.esm.json');

module.exports = {
  root: true,
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',
    'prettier',
    '@blb-ventures/eslint-config',
  ],
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  ignorePatterns: ['node_modules', 'lib', 'src/playground.ts', '.eslintrc.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: tsconfigPath,
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  rules: {
    'prettier/prettier': 'error',
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
  },
};
