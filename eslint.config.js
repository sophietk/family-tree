const neostandard = require('neostandard')

module.exports = [
  ...neostandard({
    // Common config for app, server, mongo-init
    ignores: neostandard.resolveIgnoresFromGitignore(),
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
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@stylistic/quote-props': ['error', 'as-needed', { unnecessary: false }]
    }
  }
]
