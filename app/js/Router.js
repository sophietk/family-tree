var Router = Marionette.AppRouter.extend({

    routes: {
        'home': 'home',
        'directory': 'directory',
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
    }

});