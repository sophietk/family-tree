const neostandard = require('neostandard')

module.exports = [
  ...neostandard({
    files: ['app/js/**/*.js'],
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
    },
    ignores: neostandard.resolveIgnoresFromGitignore()
  }),
  {
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@stylistic/quote-props': ['error', 'as-needed', { unnecessary: false }]
    }
  }
]
