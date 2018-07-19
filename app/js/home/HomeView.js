var HomeView = Marionette.View.extend({
  className: 'home',

  template: Handlebars.templates['home.hbs'],

  ui: {
    parallax: '.parallax'
  },

  onAttach: function () {
    this.ui.parallax.parallax()
  }

})
