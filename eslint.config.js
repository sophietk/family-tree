import neostandard from 'neostandard'

export default [
  // Apply neostandard configuration
  ...neostandard(),

  // Browser environment configuration for app/js files
  {
    files: ['app/js/**/*.js'],
    languageOptions: {
      globals: {
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
      '@stylistic/quote-props': ['error', 'as-needed', { unnecessary: false }],
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
