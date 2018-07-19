var App = Marionette.Application.extend({
  region: 'body',

  onStart: function () {
    this.showView(new RootView())
  }

})

var app = new App()
