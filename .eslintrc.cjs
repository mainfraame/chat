module.exports = {
  env: {
    amd: true,
    browser: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-plugin/recommended',
    'plugin:import/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  globals: {
    module: true,
    process: true,
    window: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      experimentalDecorators: true,
      experimentalObjectRestSpread: true,
      jsx: true,
      legacyDecorators: true
    },
    sourceType: 'module'
  },
  plugins: ['sort-keys-plus'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true }
    ],
    '@typescript-eslint/no-var-requires': 'off',
    'import/no-anonymous-default-export': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'max-nested-callbacks': 'off',
    'no-async-promise-executor': 'warn',
    'no-await-in-loop': 'warn',
    'no-promise-executor-return': 'error',
    'no-unused-vars': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react/display-name': 'warn',
    'react/jsx-sort-props': 'warn',
    'react/no-children-prop': 'warn',
    'react/no-unescaped-entities': 'warn',
    'react/prop-types': 'warn',
    'react/react-in-jsx-scope': 'off',
    'require-atomic-updates': 'warn',
    'sort-keys-plus/sort-keys': 'error'
  },
  settings: {
    'import/resolver': {
      typescript: {} // this loads <rootdir>/tsconfig.json to eslint
    },
    react: {
      version: 'detect'
    }
  }
};
