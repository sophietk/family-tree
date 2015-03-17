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

    home: function () {
        app.nudeRegion.show(new HomeView());
        app.mainRegion.reset();
        app.menuRegion.currentView.select(0);
    },

    directory: function () {
        app.nudeRegion.reset();
        app.mainRegion.show(new DirectoryView());
        app.menuRegion.currentView.select(1);
    },

    people: function (peopleId) {
        app.nudeRegion.reset();
        app.mainRegion.show(new PeopleView({peopleId: peopleId}));
        app.menuRegion.currentView.unselect();
    },

    editPeople: function (peopleId) {
        app.nudeRegion.reset();
        app.mainRegion.show(new EditView({peopleId: peopleId}));
        app.menuRegion.currentView.unselect();
    },

    createPeople: function () {
        app.nudeRegion.reset();
        app.mainRegion.show(new EditView());
        app.menuRegion.currentView.unselect();
    },

    family: function (familyId) {
        app.nudeRegion.reset();
        app.mainRegion.show(new FamilyView({familyId: familyId}));
        app.menuRegion.currentView.unselect();
    }

});