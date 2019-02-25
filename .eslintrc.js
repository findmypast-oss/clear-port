const productionCodeRules = {
  'max-lines': [
    'error',
    {
      max: 200,
      skipBlankLines: true,
      skipComments: true,
    },
  ],
  'max-statements': ['error', { max: 20 }],
  'max-params': ['error', { max: 5 }],
};

const testCodeRules = {
  'jest/no-focused-tests': 'error',
  'jest/consistent-test-it': [
    'error',
    {
      fn: 'it',
      withinDescribe: 'it',
    },
  ],
  'jest/no-test-return-statement': 'error',
  'jest/prefer-spy-on': 'error',
  'jest/prefer-strict-equal': 'error',
  'jest/prefer-to-be-null': 'error',
  'jest/prefer-to-be-undefined': 'error',
  'jest/prefer-to-contain': 'error',
  'jest/prefer-to-have-length': 'error',
};

module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  overrides: [
    {
      files: ['src/**/*.js'],
      excludedFiles: '*.spec.js',
      rules: productionCodeRules,
    },
    {
      files: ['src/**/*.spec.js'],
      rules: testCodeRules,
      env: {
        jest: true,
      },
    },
  ],
  extends: [
    'eslint-config-findmypast',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:jest/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2017,
    impliedStrict: true,
    sourceType: 'module',
  },
  plugins: ['import', 'jest'],
  rules: {
    'no-invalid-this': 'off', // doesn't work correctly with ES6 class properties
    'no-unused-vars': [
      'error',
      {
        args: 'none',
        vars: 'all',
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      },
    ],
    'no-var': 'error',
    'prefer-const': 'error',
    'import/no-named-as-default': 'error',
    'import/no-deprecated': 'error',
    'import/no-unresolved': ['error', { commonjs: true }],
    'one-var': ['error', { initialized: 'never' }],
  },
  globals: {
    expect: true,
  },
};
