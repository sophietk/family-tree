var SearchView = Marionette.View.extend({
  className: 'row',

  template: Handlebars.templates['search.hbs'],

  ui: {
    input: 'input'
  },

  events: {
    'input @ui.input': 'onChange'
  },

  onChange: function (event) {
    this.options.filterDispatcher.value = event.currentTarget.value
    this.options.filterDispatcher.trigger('change')
  }

})
