const App = Marionette.Application.extend({
  regions: {
    menuRegion: '.menu',
    mainRegion: 'main',
    nudeRegion: '.nude'
  }

})

const app = new App()
