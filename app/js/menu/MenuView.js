var MenuView = Marionette.ItemView.extend({

    tagName: 'nav',

    template: JST.menu,

    menuItems: [
        {route: 'home', title: 'tabs.home'},
        {route: 'directory', title: 'tabs.directory'},
        {route: 'people/new', title: 'tabs.create'}
    ],

    initialize: function () {
        this.collection = new MenuCollection();
        this.listenTo(this.collection, 'sync', this.addToMenuAndRender);
        this.collection.fetch();
    },

    addToMenuAndRender: function () {
        this.collection.each(function transformToMenuItem(people) {
            this.menuItems.push({
                route: 'family/' + people.get('_id'),
                title: 'tabs.pinned',
                args: {firstName: people.get('firstName')},
                className: 'teal'
            });
        }, this);
        this.render();
    },

    templateHelpers: function () {
        return {
            items: this.menuItems
        }
    },

    onRender: function () {
        this.$('.button-collapse').sideNav();
    },

    select: function (index) {
        this.$('li').eq(index).addClass('active')
            .siblings().removeClass('active');
    },

    unselect: function () {
        this.$('li').removeClass('active');
    }
});