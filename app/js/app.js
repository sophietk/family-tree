const App = Marionette.Application.extend({
  region: 'body',

  onStart: function () {
    this.showView(new RootView())
  }

})

const app = new App()
