var SearchView = Marionette.View.extend({
  className: 'input-field',

  template: Handlebars.templates['search.hbs'],

  ui: {
    input: 'input'
  },

  events: {
    'input @ui.input': 'onChange'
  },

  onChange: function (event) {
    this.getOption('filterDispatcher').trigger('change', event.currentTarget.value)
  }

})
