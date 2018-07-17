var SearchView = Marionette.ItemView.extend({
  className: 'row',

  template: Handlebars.templates['search.hbs'],

  ui: {
    input: 'input'
  },

  events: {
    'keyup @ui.input': 'onChange'
  },

  onChange: function (event) {
    this.options.filterDispatcher.value = event.currentTarget.value
    this.options.filterDispatcher.trigger('change')
  }

})
