const HomeView = Marionette.ItemView.extend({
  className: 'home',

  template: Handlebars.templates['home.hbs'],

  ui: {
    parallax: '.parallax'
  },

  onShow: function () {
    this.ui.parallax.parallax()
  }

})
