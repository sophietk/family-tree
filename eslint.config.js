const neostandard = require('neostandard')
const stylistic = require('@stylistic/eslint-plugin')

module.exports = [
  {
    ignores: neostandard.resolveIgnoresFromGitignore()
  },
  ...neostandard({
    // Common config for app, server, mongo-init
    rules: {
      '@stylistic/quote-props': ['error', 'as-needed', { unnecessary: false }]
    }
  }),
  {
    // Only for browser app files
    files: [
      'app/js/**/*.js',
    ],
    languageOptions: {
      globals: {
        Backbone: 'readonly',
        Marionette: 'readonly',
        M: 'readonly',
        _: 'readonly',
        $: 'readonly',
        jQuery: 'readonly',
        Handlebars: 'readonly',
        moment: 'readonly',
        Polyglot: 'readonly'
      }
    },
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@stylistic/quote-props': ['error', 'as-needed', { unnecessary: false }],
      'object-shorthand': ['error', 'never']
    }
  }
]
