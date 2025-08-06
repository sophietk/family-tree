import js from '@eslint/js'
import globals from 'globals'
import importPlugin from 'eslint-plugin-import'
import nodePlugin from 'eslint-plugin-n'
import promisePlugin from 'eslint-plugin-promise'

export default [
  // Base configuration for all files
  js.configs.recommended,

  // Standard-like configuration
  {
    plugins: {
      import: importPlugin,
      n: nodePlugin,
      promise: promisePlugin
    },

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2022
      }
    },

    rules: {
      // Standard rules equivalent
      'comma-dangle': ['error', 'never'],
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      'space-before-function-paren': ['error', 'always'],
      'keyword-spacing': 'error',
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'computed-property-spacing': ['error', 'never'],
      'space-in-parens': ['error', 'never'],
      'block-spacing': 'error',
      'brace-style': ['error', '1tbs'],
      camelcase: 'error',
      'comma-spacing': ['error', { before: false, after: true }],
      'comma-style': ['error', 'last'],
      'eol-last': 'error',
      'func-call-spacing': ['error', 'never'],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'new-cap': ['error', { newIsCap: true, capIsNew: false }],
      'new-parens': 'error',
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
      'no-trailing-spaces': 'error',
      'no-whitespace-before-property': 'error',
      'padded-blocks': ['error', 'never'],
      'quote-props': ['error', 'as-needed'],
      'spaced-comment': ['error', 'always'],

      // Import plugin rules
      'import/export': 'error',
      'import/first': 'error',
      'import/no-duplicates': 'error',
      'import/no-named-default': 'error',

      // Node plugin rules
      'n/handle-callback-err': ['error', '^(err|error)$'],
      'n/no-callback-literal': 'error',
      'n/no-deprecated-api': 'error',
      'n/no-exports-assign': 'error',
      'n/no-new-require': 'error',
      'n/no-path-concat': 'error',
      'n/process-exit-as-throw': 'error',

      // Promise plugin rules
      'promise/param-names': 'error',
      'promise/no-return-wrap': ['error', { allowReject: true }],
      'promise/no-new-statics': 'error',
      'promise/no-return-in-finally': 'error',
      'promise/valid-params': 'error'
    }
  },

  // Browser environment configuration for app/js files
  {
    files: ['app/js/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        // Add any global variables used in your browser code
        Backbone: 'readonly',
        Marionette: 'readonly',
        _: 'readonly',
        $: 'readonly',
        jQuery: 'readonly',
        Handlebars: 'readonly',
        moment: 'readonly',
        Polyglot: 'readonly'
      }
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'quote-props': ['error', 'as-needed', { unnecessary: false }],
      'object-shorthand': ['error', 'never']
    }
  },

  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      'app/bower_components/**',
      'dist/**',
      'zip/**',
      'app/js/templates.js',
      'app/js/partials.js'
    ]
  }
]
