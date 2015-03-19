var MenuView = Marionette.ItemView.extend({

    tagName: 'nav',

    template: JST.menu,

    menuItems: [
        {route: 'home', title: 'Home'},
        {route: 'directory', title: 'Directory'},
        {route: 'people/new', title: 'Add member'}
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
                title: people.get('firstName') + '’s family',
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

    onShow: function () {
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