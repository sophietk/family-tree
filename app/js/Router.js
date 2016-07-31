var Router = Marionette.AppRouter.extend({
  routes: {
    'home': 'home',
    'directory': 'directory',
    'people/new': 'createPeople',
    'people/:id': 'people',
    'people/:id/edit': 'editPeople',
    'family/:id': 'family',
    '': 'home'
  },

  initialize: function () {
    app.menuRegion.show(new MenuView())

    new MenuCollection()
      .on('sync', function (collection) {
        app.menuRegion.currentView.addCollectionToMenu(collection)
      })
      .fetch()
  },

  home: function () {
    app.nudeRegion.show(new HomeView())
    app.menuRegion.currentView.select(0)
    app.mainRegion.reset()
  },

  directory: function () {
    app.nudeRegion.reset()
    app.menuRegion.currentView.select(1)
    app.mainRegion.show(new LoaderView())

    new PeopleCollection()
      .on('sync', function (collection) {
        collection.models.reverse()
        app.mainRegion.show(new DirectoryView({collection: collection}))
      })
      .fetch()
  },

  createPeople: function () {
    app.nudeRegion.reset()
    app.menuRegion.currentView.unselect()
    app.mainRegion.show(new EditView({model: new PeopleModel()}))
  },

  people: function (peopleId) {
    app.nudeRegion.reset()
    app.menuRegion.currentView.unselect()
    app.mainRegion.show(new LoaderView())

    new PeopleModel({_id: peopleId})
      .on('sync', function (model) {
        app.mainRegion.show(new PeopleView({model: model}))
      })
      .fetch()
  },

  editPeople: function (peopleId) {
    app.nudeRegion.reset()
    app.menuRegion.currentView.unselect()
    app.mainRegion.show(new LoaderView())

    new PeopleModel({_id: peopleId})
      .on('sync', function (model) {
        app.mainRegion.show(new EditView({model: model}))
      })
      .fetch()
  },

  family: function (familyId) {
    app.nudeRegion.reset()
    app.menuRegion.currentView.unselect()
    app.mainRegion.show(new LoaderView())

    new FamilyModel({_id: familyId})
      .on('sync', function (model) {
        app.mainRegion.show(new FamilyView({model: model}))
      })
      .fetch()
  }

})
