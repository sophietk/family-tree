var MenuView = Backbone.View.extend({

    tagName: 'nav',

    template: $('#tpl-menu').html(),

    events: {
        'click .directory': 'showDirectory'
    },

    render: function () {
        this.$el.html(this.template);
        this.$el.append();
        return this;
    },

    showDirectory: function () {
        $('main').html(new DirectoryView().el);
    }

});