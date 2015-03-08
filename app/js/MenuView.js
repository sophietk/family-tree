var MenuView = Marionette.ItemView.extend({

    tagName: 'nav',

    template: '#tpl-menu',

    events: {
        'click .directory': 'showDirectory'
    },

    showDirectory: function () {
        app.mainRegion.show(new DirectoryView());
    }

});