var MenuView = Marionette.ItemView.extend({

    tagName: 'nav',

    template: '#tpl-menu',

    events: {
        'click .directory': 'showDirectory'
    },

    showDirectory: function () {
        app.nudeRegion.reset();
        app.mainRegion.show(new DirectoryView(), {className: 'container'});
    }

});