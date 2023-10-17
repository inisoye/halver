console.log(path.resolve(__dirname, 'tsconfig.json'));

module.exports = {
  extends: [
    '@react-native-community',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'canonical'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        project: path.resolve(__dirname, 'tsconfig.json'),
      },
    },
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-use-before-define': 'error',
    'canonical/no-barrel-import': 2,
    'no-console': [
      'error',
      {
        allow: ['error'],
      },
    ],
    'no-unused-vars': 'off',
    'prefer-const': 'error',
    'react/jsx-sort-props': [
      2,
      {
        callbacksLast: true,
        ignoreCase: true,
        noSortAlphabetically: false,
        shorthandFirst: false,
        shorthandLast: true,
      },
    ],
    'react/no-unknown-property': [
      2,
      {
        ignore: ['jsx'],
      },
    ],
  },
};
