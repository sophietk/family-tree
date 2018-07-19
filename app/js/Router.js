var AppController = {
  home: function () {
    app.getView().showHome()
  },

  directory: function () {
    app.getView().showDirectory()
  },

  createPeople: function () {
    app.getView().showCreatePeople()
  },

  people: function (peopleId) {
    app.getView().showPeople(peopleId)
  },

  editPeople: function (peopleId) {
    app.getView().showEditPeople(peopleId)
  },

  family: function (peopleId) {
    app.getView().showFamily(peopleId)
  }
}

var Router = Marionette.AppRouter.extend({
  controller: AppController,

  appRoutes: {
    'home': 'home',
    'directory': 'directory',
    'people/new': 'createPeople',
    'people/:id': 'people',
    'people/:id/edit': 'editPeople',
    'family/:id': 'family',
    '': 'home'
  }
})
